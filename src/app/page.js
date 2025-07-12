/**
 * Homepage - SuiReNアプリケーションのトップページ
 * 
 * 機能:
 * - ヒーローセクションでサイトの紹介（インパクトのあるデザイン）
 * - 3ステップの練習方法を視覚的に表示
 * - 速読効果の簡潔な説明
 * - /aboutページへの誘導
 * - モダンでレスポンシブなデザイン
 */

import Link from 'next/link';

/**
 * ホームページコンポーネント
 * 
 * @returns {JSX.Element} ホームページ要素
 */
export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ===== ヒーローセクション ===== */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-20">
        {/* 動的背景 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* メインコンテンツ */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* ロゴアニメーション */}
          <div className="mb-8 transform hover:scale-110 transition-transform duration-500">
            <img 
              src="/logos/gorilla-only-animated.svg" 
              alt="SuiReN" 
              className="h-32 sm:h-40 lg:h-48 w-auto mx-auto filter drop-shadow-2xl"
            />
          </div>

          {/* タイトル */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              SuiReN
            </span>
          </h1>

          {/* サブタイトル */}
          <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-700 mb-4">
            日本語学習者のための
          </p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-12">
            インタラクティブ速読練習
          </p>

          {/* キャッチコピー */}
          <div className="mb-12 max-w-2xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed">
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                速く
              </span>
              、
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                正確に
              </span>
              、
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600">
                楽しく
              </span>
              <br />
              日本語の文章を読む力を身につけよう
            </p>
          </div>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/reading"
              className="group relative px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">今すぐ始める</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              href="#how-to"
              className="px-10 py-5 text-xl font-semibold text-gray-700 bg-white/80 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:bg-white transform hover:scale-105 transition-all duration-300 border border-gray-200"
            >
              練習方法を見る
            </Link>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* ===== このサイトについてセクション ===== */}
      <div className="relative py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                このサイトについて
              </span>
            </h2>
            
            <div className="text-gray-700 space-y-6 leading-relaxed">
              <p className="text-lg">
                このウェブサイトでは、日本語を「速く読む練習」ができます。
              </p>
              
              <p className="text-lg">
                私たちは、みなさんに日本語の文章を、楽しくスラスラと読んでほしいと思います。
              </p>
              
              <p className="text-lg">
                「<span className="font-bold text-blue-600">SuiReN</span>」の練習では、簡単な文章を、なるべく速く読みます。でも、速すぎてはだめです。だいたいの意味がわかるように、そして、速く読んでください。何回もこの練習をしていると、楽しくスラスラ読めるようになりますよ。
              </p>
              
              <div className="text-center mt-8">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  みなさん、がんばって！
                </p>
                <p className="text-lg text-gray-600">
                  SuiReN・チーム
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3ステップ練習方法セクション ===== */}
      <div id="how-to" className="relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* セクションタイトル */}
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3ステップで簡単
              </span>
            </h2>
            <p className="text-2xl text-gray-600">SuiReNの練習方法</p>
          </div>

          {/* 3ステップカード */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* ステップ1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="text-6xl font-black text-blue-500 mb-4">01</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">レベルを選ぶ</h3>
                <p className="text-gray-600 leading-relaxed">
                  自分のレベルに合った文章を選びます。簡単すぎず、難しすぎない、ちょうどいいレベルから始めましょう。
                </p>
              </div>
            </div>

            {/* ステップ2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="text-6xl font-black text-purple-500 mb-4">02</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">速く読む</h3>
                <p className="text-gray-600 leading-relaxed">
                  <span className="font-bold text-purple-600">大体の意味がわかる速さ</span>で読みます。完璧に理解しようとせず、全体の流れをつかみましょう。
                </p>
              </div>
            </div>

            {/* ステップ3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="text-6xl font-black text-pink-500 mb-4">03</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">結果を確認</h3>
                <p className="text-gray-600 leading-relaxed">
                  読み終わったら、理解度クイズに答えて、速度と理解度のバランスをチェックします。
                </p>
              </div>
            </div>
          </div>

          {/* 重要ポイント */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-orange-200 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-center text-orange-800 mb-4">
                速さと理解のバランスが大切！
              </h3>
              <p className="text-lg text-center text-orange-700 leading-relaxed">
                速すぎて何もわからないのはダメ。<br />
                遅すぎて全部理解しようとするのもダメ。<br />
                <span className="font-bold text-xl">ちょうどいい速さ</span>を見つけることが、速読上達の秘訣です。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 効果と特徴セクション ===== */}
      <div className="relative py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              なぜSuiReN？
            </h2>
            <p className="text-xl text-gray-600">科学的に設計された速読練習システム</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左側：特徴リスト */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">レベル別コンテンツ</h3>
                  <p className="text-gray-600">中級前半から上級まで、段階的に速読力を向上</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">リアルタイム測定</h3>
                  <p className="text-gray-600">読書速度（WPM）と理解度を即座に計測</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">インタラクティブ学習</h3>
                  <p className="text-gray-600">クイズ形式で楽しく理解度をチェック</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">進歩の可視化</h3>
                  <p className="text-gray-600">練習の成果が数値で確認できる</p>
                </div>
              </div>
            </div>

            {/* 右側：効果説明 */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-10 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">速読で得られる効果</h3>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  文章を<span className="font-bold text-blue-600">速く読む</span>ことで、全体の意味を効率的に把握できるようになります。
                </p>
                <p className="leading-relaxed">
                  継続的な練習により、日本語の<span className="font-bold text-purple-600">読解の自動性</span>が向上し、母語話者に近い流暢な読みが可能になります。
                </p>
                <p className="leading-relaxed">
                  速読スキルは、<span className="font-bold text-pink-600">学習効率の向上</span>にもつながり、より多くの日本語に触れることができます。
                </p>
              </div>
              <div className="mt-8">
                <Link 
                  href="/about"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
                >
                  理論的背景について詳しく見る
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 最終CTA ===== */}
      <div className="relative py-20 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            準備はできましたか？
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
            今日から<br />
            日本語の文章をスイスイ読めるようになりましょう！
          </p>
          
          <Link 
            href="/reading"
            className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold text-gray-800 bg-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">速読練習を始める</span>
            <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <div className="mt-8">
            <p className="text-white/70 text-lg">
              SuiReN・チーム
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}