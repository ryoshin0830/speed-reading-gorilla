import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { 
  LEVEL_CODES,
  LEVEL_DISPLAY_NAMES,
  DISPLAY_NAME_TO_LEVEL_CODE,
  getLevelCode
} from '../../../../lib/level-constants';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Read the Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Check if required sheets exist
    if (!workbook.SheetNames.includes('コンテンツ')) {
      return NextResponse.json(
        { error: 'テンプレートファイルが正しくありません。「コンテンツ」シートが見つかりません。' },
        { status: 400 }
      );
    }

    // Parse content sheet
    const contentSheet = workbook.Sheets['コンテンツ'];
    const contentData = XLSX.utils.sheet_to_json(contentSheet, { header: 1 });

    // Extract basic information using new table format
    let title = '';
    let level = LEVEL_DISPLAY_NAMES.BEGINNER;
    let text = '';
    let explanation = '';

    // Find and extract data from table format
    for (let i = 0; i < contentData.length; i++) {
      const row = contentData[i];
      if (!row || row.length === 0) continue;

      // Skip header row
      if (row[0] === '項目') continue;

      // Extract data based on first column (項目)
      if (row[0] === 'タイトル' && row[1]) {
        title = row[1].toString().trim();
      } else if (row[0] === 'レベル' && row[1]) {
        const levelValue = row[1].toString().trim();
        if ([LEVEL_DISPLAY_NAMES.BEGINNER, LEVEL_DISPLAY_NAMES.INTERMEDIATE, LEVEL_DISPLAY_NAMES.ADVANCED].includes(levelValue)) {
          level = levelValue;
        }
      } else if (row[0] === '本文' && row[1]) {
        // Get the text content directly from row[1]
        const textContent = row[1].toString().trim();
        
        // Filter out instruction/example text from the content
        const filteredLines = textContent.split('\n').filter(line => {
          const trimmedLine = line.trim();
          // Skip ruby notation instructions and examples
          return !trimmedLine.includes('ルビの記法：') &&
                 !trimmedLine.includes('ここに本文を入力してください') &&
                 !trimmedLine.includes('※') &&
                 !trimmedLine.includes('例：') &&
                 !trimmedLine.startsWith('・');
        });
        
        text = filteredLines.join('\n').trim();
        
        // Handle multiline text - check if there are continuation rows
        let j = i + 1;
        while (j < contentData.length && contentData[j] && !contentData[j][0]) {
          if (contentData[j][1]) {
            const continuationText = contentData[j][1].toString().trim();
            // Apply same filtering to continuation lines
            if (!continuationText.includes('ルビの記法：') &&
                !continuationText.includes('ここに本文を入力してください') &&
                !continuationText.includes('※') &&
                !continuationText.includes('例：') &&
                !continuationText.startsWith('・')) {
              text += '\n' + continuationText;
            }
          }
          j++;
        }
      } else if (row[0] === '文章の解説' && row[1]) {
        // Get the explanation content directly from row[1]
        const explanationContent = row[1].toString().trim();
        
        // Filter out instruction text from the explanation
        const filteredExplanation = explanationContent.split('\n').filter(line => {
          const trimmedLine = line.trim();
          return !trimmedLine.includes('ここに文章の解説を入力してください') &&
                 !trimmedLine.includes('※') &&
                 !trimmedLine.includes('例：') &&
                 !trimmedLine.startsWith('・');
        });
        
        explanation = filteredExplanation.join('\n').trim();
        
        // Handle multiline explanation - check if there are continuation rows
        let j = i + 1;
        while (j < contentData.length && contentData[j] && !contentData[j][0]) {
          if (contentData[j][1]) {
            const continuationExplanation = contentData[j][1].toString().trim();
            // Apply same filtering to continuation lines
            if (!continuationExplanation.includes('ここに文章の解説を入力してください') &&
                !continuationExplanation.includes('※') &&
                !continuationExplanation.includes('例：') &&
                !continuationExplanation.startsWith('・')) {
              explanation += '\n' + continuationExplanation;
            }
          }
          j++;
        }
      }
    }

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'タイトルが入力されていません' },
        { status: 400 }
      );
    }
    if (!text) {
      return NextResponse.json(
        { error: '本文が入力されていません' },
        { status: 400 }
      );
    }

    // Parse questions sheet if it exists
    let questions = [];
    if (workbook.SheetNames.includes('問題')) {
      const questionsSheet = workbook.Sheets['問題'];
      const questionsData = XLSX.utils.sheet_to_json(questionsSheet, { header: 1 });

      // Find the header row by looking for "問題番号"
      let headerIndex = -1;
      let headers = [];
      for (let i = 0; i < questionsData.length; i++) {
        const row = questionsData[i];
        if (row && row[0] === '問題番号') {
          headerIndex = i;
          headers = row;
          break;
        }
      }

      if (headerIndex !== -1 && headers.length > 0) {
        // Identify column indices
        const columnMap = {};
        headers.forEach((header, index) => {
          if (header) {
            const headerStr = header.toString().trim();
            if (headerStr === '問題番号') columnMap.questionNumber = index;
            else if (headerStr === '問題文') columnMap.questionText = index;
            else if (headerStr.startsWith('選択肢')) columnMap[headerStr] = index;
            else if (headerStr === '正解番号') columnMap.correctAnswer = index;
            else if (headerStr === '解説') columnMap.explanation = index;
          }
        });

        // Collect all option columns dynamically
        const optionColumns = [];
        Object.keys(columnMap).forEach(key => {
          if (key.startsWith('選択肢')) {
            optionColumns.push({ key, index: columnMap[key] });
          }
        });
        // Sort by the number in the column name to ensure correct order
        optionColumns.sort((a, b) => {
          const numA = parseInt(a.key.replace('選択肢', '')) || 0;
          const numB = parseInt(b.key.replace('選択肢', '')) || 0;
          return numA - numB;
        });

        // Parse questions
        for (let i = headerIndex + 1; i < questionsData.length; i++) {
          const row = questionsData[i];
          if (!row || row.length === 0) continue;
          
          // Get question text
          const questionText = columnMap.questionText !== undefined && row[columnMap.questionText] 
            ? row[columnMap.questionText].toString().trim() 
            : '';
          
          if (!questionText) continue; // Skip empty questions

          // Collect options
          const options = [];
          optionColumns.forEach(({ index }) => {
            if (row[index]) {
              const option = row[index].toString().trim();
              if (option) {
                options.push(option);
              }
            }
          });

          if (options.length < 2) continue; // Skip if less than 2 options

          // Get correct answer (convert from 1-based to 0-based)
          let correctAnswer = 0;
          if (columnMap.correctAnswer !== undefined && row[columnMap.correctAnswer]) {
            const answerNum = parseInt(row[columnMap.correctAnswer]);
            if (!isNaN(answerNum) && answerNum >= 1 && answerNum <= options.length) {
              correctAnswer = answerNum - 1;
            }
          }

          // Get explanation
          const questionExplanation = columnMap.explanation !== undefined && row[columnMap.explanation]
            ? row[columnMap.explanation].toString().trim()
            : '';

          questions.push({
            question: questionText,
            options: options,
            correctAnswer: correctAnswer,
            explanation: questionExplanation
          });
        }
      }
    }

    // Determine level code
    const levelCode = getLevelCode(level);

    // Prepare the content data
    const contentData2 = {
      title,
      level,
      levelCode,
      text,
      explanation: explanation || '',
      questions: questions, // Empty array is OK - ContentEditor will handle it
      images: [],
      thumbnail: null,
      isFromExcel: true // Flag to indicate this came from Excel import
    };

    return NextResponse.json({
      success: true,
      data: contentData2
    });

  } catch (error) {
    console.error('Error processing Excel file:', error);
    return NextResponse.json(
      { error: 'ファイルの処理中にエラーが発生しました: ' + error.message },
      { status: 500 }
    );
  }
}