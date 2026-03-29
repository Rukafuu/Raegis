export type Language = 'en' | 'es' | 'ja' | 'pt';

export const translations = {
  en: {
    nav: {
      howItWorks: "How it Works",
      demo: "Demo",
      contact: "Contact Us",
      github: "GitHub"
    },
    hero: {
      title: "Raegis: The Diagnostic Stethoscope for AI",
      subtitle: "Monitoring, diagnostics & truth anchoring for local LLMs. Version 2.0 adds ML Drift monitoring, SHAP explanations, and Truth Anchors via Gemini.",
      ctaRepo: "Access Repository",
      ctaDocs: "Quick Start"
    },
    howItWorks: {
      title: "Diagnostic Pipeline",
      subtitle: "Auditing neural pathways to ensure deterministic reliability in stochastic environments.",
      steps: [
        {
          title: "Adversarial Stress",
          desc: "Firing perturbed prompts (typos, jailbreaks) to probe stability and safety boundaries.",
          badge: "STRESS TEST"
        },
        {
          title: "Production Drift",
          desc: "Continuously monitoring tabular stability (PSI) and F1-score degradation over time.",
          badge: "MONITORING"
        },
        {
          title: "SHAP Diagnosis",
          desc: "Explaining internal feature shifts to identify WHY the model's focus is changing.",
          badge: "EXPLAINABILITY"
        },
        {
          title: "Truth Anchor",
          desc: "Gemini 1.5 acting as a 'Doctor' to audit local hallucination breaking points.",
          badge: "VALIDATION"
        }
      ]
    },
    whyRaegis: {
      title: "Why Raegis?",
      subtitle: "AI development is often a 'black box' once you move past Temperature 0.0. Raegis provides the 'Reliability Curve' that every AI engineer needs:",
      items: [
        { title: "Find the Rupture Point", desc: "Know exactly when your model starts losing its mind." },
        { title: "Audit RAG Integrity", desc: "Quantify how much 'noise' is entering your retrieval pipeline." },
        { title: "Detect Hidden Anomalies", desc: "Identify non-deterministic hallucinations before your users do." },
        { title: "MLOps for Fine-Tuning", desc: "If your model becomes 'Overfitted' or 'Destabilized' after training, Raegis will tell you exactly where it went wrong." }
      ]
    },
    coreFeatures: {
      title: "Raegis v2.0 Elite Features",
      items: [
        { title: "Drift Monitoring (PSI)", desc: "Track model stability across weeks of production traffic with Population Stability Index.", tooltip: "Detects feature distribution shifts before they impact accuracy." },
        { title: "SHAP Explainability", desc: "Interactive dashboard showing how feature attribution shifted during a drift event.", tooltip: "Visual evidence of why the model stopped working as expected." },
        { title: "Truth Anchor (Gemini)", desc: "Uses Gemini 1.5 as a 'Doctor' to provide factual diagnosis of local LLM responses.", tooltip: "Cross-model validation to eliminate confident hallucinations." },
        { title: "Adversarial Stress Tester", desc: "Automated battery of tests (typos, negations, tone) to stress-test your prompts.", tooltip: "Benchmarks your model's robustness against real-world user noise." },
        { title: "Guardian (Neural AE)", desc: "Detects neural anomalies (hallucinations) in high-temperature stochastic outputs.", tooltip: "Deep neural inspection for expert users and researchers." }
      ]
    },
    installation: {
      title: "Installation",
      subtitle: "Raegis provides dependency tiers with optional extras tailored to lightweight or heavy-duty environments:",
      clone: "Clone the Repository"
    },
    apiUsage: {
      title: "Python API Usage",
      sections: [
        { title: "1. Behavioral Diagnostics", desc: "Audits from 0.0 to 1.5, generating N samples per temperature", tooltip: "Automated stability profiling across temperature ramps." },
        { title: "2. Anchor Test (RAG Validation)", desc: "Measures the fidelity between the model's output and the retrieved ground truth.", tooltip: "Semantic fidelity check for RAG pipelines." },
        { title: "3. Fine-Tuning Validation", desc: "Did your base model significantly degrade after training that 6h LoRA?", tooltip: "Detects performance drops and overfitting after fine-tuning." },
        { title: "4. Whitebox / Graybox Inspector", desc: "Instead of generating multiple text responses and comparing them (blackbox inference), the Inspector directly accesses the LLM's internal token probabilities in a single forward pass.", tooltip: "Direct access to token probabilities for 100x faster auditing." }
      ]
    },
    jsUsage: {
      title: "JavaScript / Node.js API",
      sections: [
        { title: "1. Native Port", desc: "Native TypeScript implementation with no Python dependency.", tooltip: "Lightweight and high-performance." },
        { title: "2. TensorFlow.js Integration", desc: "Run neural anomaly detection directly in the browser or Node.js.", tooltip: "Hardware-accelerated auditing via TF.js." },
        { title: "3. Raegis Server", desc: "Run as a standalone REST API for your Gemma or Llama demos.", tooltip: "Ready-to-use backend service." }
      ]
    },
    architecture: {
      title: "Open Source Architecture",
      items: [
        "python/raegis/drift/ ML drift monitoring module",
        "python/raegis/core/doctor.py gemini truth anchor",
        "javascript/src/raegis/ Raegis-JS observer & bridge",
        "python/raegis/stress_test.py adversarial benchmarking"
      ]
    },
    changelog: {
      title: "Changelog",
      items: [
        { 
          version: "2.0.0", 
          date: "2026-03-29", 
          desc: "The Diagnostic Overhaul: Drift, SHAP, Stress Test, Truth Anchor.",
          snippet: "from raegis.drift import DriftMonitor\n\nmonitor = DriftMonitor(model_path='fraud_model.xgb')\nresults = monitor.run_simulation(weeks=12)\nprint(f'PSI Drift: {results.psi}')"
        },
        { 
          version: "1.0.0", 
          date: "2026-03-25", 
          desc: "Initial dual-core release (Python + JS Support).",
          snippet: "const auditor = new Raegis.Auditor({ model: 'gemma' });\nconst report = await auditor.audit('Hello World');"
        }
      ]
    },
    contact: {
      title: "Contact Us",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send Message",
      success: "Message sent successfully!"
    },
    footer: {
      builtBy: "Built by Lucas Frischeisen"
    }
  },
  pt: {
    nav: {
      howItWorks: "Como Funciona",
      demo: "Demo",
      contact: "Fale Conosco",
      github: "GitHub"
    },
    hero: {
      title: "Raegis: O Estetoscópio de Diagnóstico para IA",
      subtitle: "Monitoramento, diagnósticos e ancoragem de verdade para LLMs locais. A v2.0 adiciona Drift, SHAP e Truth Anchors via Gemini.",
      ctaRepo: "Acessar Repositório",
      ctaDocs: "Como Começar"
    },
    howItWorks: {
      title: "Pipeline de Diagnóstico",
      subtitle: "Auditando caminhos neurais para garantir confiabilidade determinística em ambientes estocásticos.",
      steps: [
        {
          title: "Stress Adversarial",
          desc: "Disparo de prompts perturbados (erros, jailbreaks) para sondar limites de estabilidade e segurança.",
          badge: "STRESS TEST"
        },
        {
          title: "Drift de Produção",
          desc: "Monitoramento contínuo da estabilidade tabular (PSI) e degradação do F1-score no tempo.",
          badge: "MONITORAMENTO"
        },
        {
          title: "Diagnóstico SHAP",
          desc: "Explicação dos desvios internos das features para identificar POR QUE o foco do modelo mudou.",
          badge: "EXPLICABILIDADE"
        },
        {
          title: "Truth Anchor",
          desc: "Gemini 1.5 agindo como o 'Doutor' para auditar pontos de ruptura de alucinação local.",
          badge: "VALIDAÇÃO"
        }
      ]
    },
    whyRaegis: {
      title: "Por que Raegis?",
      subtitle: "O desenvolvimento de IA é frequentemente uma 'caixa preta' após a Temperatura 0.0. Raegis fornece a 'Curva de Confiabilidade' que todo engenheiro de IA precisa:",
      items: [
        { title: "Encontre o Ponto de Ruptura", desc: "Saiba exatamente quando seu modelo começa a perder o sentido." },
        { title: "Audite a Integridade do RAG", desc: "Quantifique quanto 'ruído' está entrando em seu pipeline de recuperação." },
        { title: "Detecte Anomalias Ocultas", desc: "Identifique alucinações não determinísticas antes que seus usuários o façam." },
        { title: "MLOps para Fine-Tuning", desc: "Se o seu modelo se tornar 'Overfitted' ou 'Desestabilizado' após o treinamento, o Raegis dirá exatamente onde deu errado." }
      ]
    },
    coreFeatures: {
      title: "Recursos de Elite v2.0",
      items: [
        { title: "Monitoramento de Drift", desc: "Acompanhe a estabilidade das features com o Population Stability Index (PSI).", tooltip: "Detecta mudanças na distribuição dos dados antes que impactem a acurácia." },
        { title: "Explicabilidade SHAP", desc: "Dashboard interativo mostrando como o peso das features mudou durante um evento de drift.", tooltip: "Evidência visual de por que o modelo parou de funcionar como esperado." },
        { title: "Truth Anchor (Gemini)", desc: "Usa o Gemini 1.5 como o 'Doutor' para fornecer diagnósticos factuais de respostas locais.", tooltip: "Validação cross-model para eliminar alucinações confiantes." },
        { title: "Stress Tester Adversarial", desc: "Bateria automatizada de testes (erros, negação, tom) para testar seus prompts no limite.", tooltip: "Mede a resiliência do seu modelo contra ruído do usuário real." },
        { title: "Guardian (Neural AE)", desc: "Detecta anomalias neurais (alucinações) em saídas estocásticas de alta temperatura.", tooltip: "Inspeção neural profunda para usuários especialistas e pesquisadores." }
      ]
    },
    installation: {
      title: "Instalação",
      subtitle: "Raegis fornece níveis de dependência com extras opcionais adaptados para ambientes leves ou pesados:",
      clone: "Clonar o Repositório"
    },
    apiUsage: {
      title: "Uso da API Python",
      sections: [
        { title: "1. Diagnósticos Comportamentais", desc: "Auditorias de 0.0 a 1.5, gerando N amostras por temperatura", tooltip: "Perfil de estabilidade automatizado em rampas de temperatura." },
        { title: "2. Anchor Test (Validação RAG)", desc: "Mede a fidelidade entre a saída do modelo e a verdade fundamental recuperada.", tooltip: "Verificação de fidelidade semântica para pipelines RAG." },
        { title: "3. Validação de Fine-Tuning", desc: "Seu modelo base degradou significativamente após o treinamento daquele LoRA de 6h?", tooltip: "Detecta quedas de desempenho e overfitting após o ajuste fino." },
        { title: "4. Inspetor Whitebox / Graybox", desc: "Em vez de gerar várias respostas de texto e compará-las (inferência de caixa preta), o Inspetor acessa diretamente as probabilidades internas de token do LLM em uma única passagem direta.", tooltip: "Acesso direto às probabilidades de token para auditoria 100x mais rápida." }
      ]
    },
    jsUsage: {
      title: "API JavaScript / Node.js",
      sections: [
        { title: "1. Port Nativo", desc: "Implementação nativa em TypeScript sem dependência de Python.", tooltip: "Leve e de alta performance." },
        { title: "2. Integração TensorFlow.js", desc: "Execute detecção de anomalias neurais direto no browser ou Node.js.", tooltip: "Auditoria acelerada por hardware via TF.js." },
        { title: "3. Raegis Server", desc: "Execute como uma API REST independente para seus demos de Gemma ou Llama.", tooltip: "Serviço de backend pronto para uso." }
      ]
    },
    architecture: {
      title: "Arquitetura de Código Aberto",
      items: [
        "python/raegis/drift/ módulo de monitoramento de drift",
        "python/raegis/core/doctor.py âncora de verdade gemini",
        "javascript/src/raegis/ observer & bridge para Raegis-JS",
        "python/raegis/stress_test.py benchmarking adversarial"
      ]
    },
    changelog: {
      title: "Changelog",
      items: [
        { 
          version: "2.0.0", 
          date: "2026-03-29", 
          desc: "Overhaul de Diagnósticos: Drift, SHAP, Stress Test, Truth Anchor.",
          snippet: "from raegis.drift import DriftMonitor\n\n# Diagnóstico de Drift em Produção\nmonitor = DriftMonitor()\nmonitor.run_simulation()"
        },
        { 
          version: "1.0.0", 
          date: "2026-03-25", 
          desc: "Lançamento dual-core inicial (Suporte Python + JS).",
          snippet: "import Raegis from 'raegis';\n\nconst auditor = new Raegis.Auditor();\nawait auditor.audit('Prompt Test');"
        }
      ]
    },
    contact: {
      title: "Fale Conosco",
      name: "Nome",
      email: "E-mail",
      message: "Mensagem",
      submit: "Enviar Mensagem",
      success: "Mensagem enviada com sucesso!"
    },
    footer: {
      builtBy: "Criado por Lucas Frischeisen"
    }
  },
  es: {
    nav: {
      howItWorks: "Cómo Funciona",
      demo: "Demo",
      contact: "Contáctanos",
      github: "GitHub"
    },
    hero: {
      title: "Raegis: El Estetoscopio para LLMs Locales",
      subtitle: "Control de alucinación, sesgo y entropía para modelos locales usando Keras e Scikit-learn. Privacidad primero, sin APIs pagas.",
      ctaRepo: "Acceder al Repositorio",
      ctaDocs: "Empezar"
    },
    howItWorks: {
      title: "Cómo Funciona",
      steps: [
        {
          title: "Prueba de Estrés",
          desc: "Disparo de prompts variando la temperatura del modelo para probar límites de estabilidad.",
          badge: "ENTRADA"
        },
        {
          title: "Raegis Guardian",
          desc: "Autoencoder de Keras detectando anomalías neuronales mediante error de reconstrucción.",
          badge: "ANÁLISIS"
        },
        {
          title: "Validación Semántica",
          desc: "Scikit-learn y Pandas calculando Entropía de Shannon y métricas de consistencia.",
          badge: "MÉTRICAS"
        },
        {
          title: "Respuesta Auditada",
          desc: "La librería bloquea alucinaciones antes de que lleguen al usuario final.",
          badge: "SALIDA"
        }
      ]
    },
    whyRaegis: {
      title: "¿Por qué Raegis?",
      subtitle: "El desarrollo de IA suele ser una 'caja negra' una vez que se supera la Temperatura 0.0. Raegis proporciona la 'Curva de Confiabilidad' que todo ingeniero de IA necesita:",
      items: [
        { title: "Encuentre el punto de ruptura", desc: "Sepa exactamente cuándo su modelo comienza a perder el sentido." },
        { title: "Audite la integridad de RAG", desc: "Cuantifique cuánto 'ruído' entra en su flujo de recuperación." },
        { title: "Detecte anomalías ocultas", desc: "Identifique alucinaciones no deterministas antes que sus usuarios." },
        { title: "MLOps para Fine-tuning", desc: "Si su modelo se vuelve 'Overfitted' o 'Desestabilizado' después del entrenamiento, Raegis le dirá exactamente dónde salió mal." }
      ]
    },
    coreFeatures: {
      title: "Características Principales",
      items: [
        { title: "Panel visual de Streamlit", desc: "Siga los mapas de calor y los límites de comportamiento de su modelo en tiempo real.", tooltip: "Interfaz interactiva para auditoría de modelos y visualización de pruebas de estrés." },
        { title: "Prueba de anclaje (validación RAG)", desc: "Mide la fidelidad semántica (similitud de coseno mediante embeddings) de la salida del modelo frente a un contexto de anclaje proporcionado.", tooltip: "Asegura que las salidas de RAG no se desvíen del contexto de origen." },
        { title: "Inspector de caja blanca", desc: "Extrae la entropía real a nivel de token utilizando API directas de logprobs (Ollama) o tensores de modelo (HuggingFace transformers), lo que genera información 100 veces más rápida que la inferencia de comportamiento de caja negra.", tooltip: "Inspección neural profunda para usuarios expertos e investigadores." },
        { title: "Comparador antes/después", desc: "La herramienta definitiva de MLOps para la validación de Fine-tuning. Calcula el Delta de Confianza y el Desvío de Personalidad.", tooltip: "Esencial para pruebas de regresión y detección de desvíos." },
        { title: "Guardian (Autoencoder neuronal)", desc: "Detecta anomalías en salidas de alta temperatura utilizando TensorFlow/Keras (con Scikit-Learn como respaldo ligero).", tooltip: "Capa de seguridad en tiempo real para salidas estocásticas de alta temperatura." }
      ]
    },
    installation: {
      title: "Instalación",
      subtitle: "Raegis proporciona niveles de dependencia con extras opcionales adaptados para entornos ligeros o pesados:",
      clone: "Clonar el Repositorio"
    },
    apiUsage: {
      title: "Uso de la API de Python",
      sections: [
        { title: "1. Diagnóstico de Comportamiento", desc: "Auditorías de 0.0 a 1.5, generando N muestras por temperatura", tooltip: "Perfilado de estabilidad automatizado en rampas de temperatura." },
        { title: "2. Prueba de Anclaje (Validación RAG)", desc: "Mide la fidelidad entre la saída del modelo y la verdad fundamental recuperada.", tooltip: "Verificación de fidelidad semántica para pipelines RAG." },
        { title: "3. Validación de Fine-tuning", desc: "¿Su modelo base se degradó significativamente después de entrenar ese LoRA de 6 horas?", tooltip: "Detecta caídas de rendimiento y sobreajuste después del ajuste fino." },
        { title: "4. Inspector de caja blanca / caja gris", desc: "En lugar de generar múltiples respuestas de texto e compararlas (inferencia de caja negra), el Inspector accede directamente a las probabilidades de token internas del LLM en una sola pasada.", tooltip: "Acceso directo a las probabilidades de token para una auditoría 100 veces más rápida." }
      ]
    },
    jsUsage: {
      title: "API de JavaScript / Node.js",
      sections: [
        { title: "1. Port Nativo", desc: "Implementación nativa en TypeScript sin dependencias de Python.", tooltip: "Ligero y de alto rendimiento." },
        { title: "2. Integración TensorFlow.js", desc: "Ejecute detección de anomalías neuronales directamente en el navegador o Node.js.", tooltip: "Auditoría acelerada por hardware vía TF.js." },
        { title: "3. Raegis Server", desc: "Ejecute como una API REST independiente para sus demos de Gemma ou Llama.", tooltip: "Servicio de backend listo para usar." }
      ]
    },
    architecture: {
      title: "Arquitectura de Código Abierto",
      items: [
        "python/raegis/drift/ módulo de monitoreo de drift",
        "python/raegis/core/doctor.py gemini truth anchor",
        "javascript/src/raegis/ observer & bridge para Raegis-JS",
        "python/raegis/stress_test.py benchmarking adversarial"
      ]
    },
    changelog: {
      title: "Changelog",
      items: [
        { 
          version: "2.0.0", 
          date: "2026-03-29", 
          desc: "The Diagnostic Overhaul: Drift, SHAP, Stress Test, Truth Anchor.",
          snippet: "from raegis.drift import DriftMonitor # Monitoreo"
        },
        { 
          version: "1.0.0", 
          date: "2026-03-25", 
          desc: "Initial dual-core release (Python + JS Support).",
          snippet: "const auditor = new Raegis.Auditor();"
        }
      ]
    },
    contact: {
      title: "Contáctenos",
      name: "Nombre",
      email: "Correo Electrónico",
      message: "Mensaje",
      submit: "Enviar Mensagem",
      success: "¡Mensaje enviado con éxito!"
    },
    footer: {
      builtBy: "Desarrollado por Lucas Frischeisen"
    }
  },
  ja: {
    nav: {
      howItWorks: "仕組み",
      demo: "デモ",
      contact: "お問い合わせ",
      github: "GitHub"
    },
    hero: {
      title: "Raegis: ローカルLLMのための聴診器",
      subtitle: "KerasとScikit-learnを使用したローカルモデルの幻覚、バイアス、エントロピー制御。プライバシー優先、有料API不要。",
      ctaRepo: "リポジトリにアクセス",
      ctaDocs: "使ってみる"
    },
    howItWorks: {
      title: "仕組み",
      subtitle: "確率的環境における決定論的な信頼性を確保するために神経経路を監査します。",
      steps: [
        {
          title: "ストレステスト",
          desc: "安定性の境界を調査するために、モデルの温度を変化させながらプロンプトを実行します。",
          badge: "入力"
        },
        {
          title: "Raegis Guardian",
          desc: "再構成誤差分析を通じて神経異常を検出するKerasオートエンコーダー。",
          badge: "分析"
        },
        {
          title: "意味的検証",
          desc: "シャノンエントロピーと一貫性メトリクスを計算するScikit-learnとPandas。",
          badge: "メトリクス"
        },
        {
          title: "監査済みレスポンス",
          desc: "ライブラリは、幻覚がエンドユーザーに到達する前にブロックします。",
          badge: "出力"
        }
      ]
    },
    whyRaegis: {
      title: "なぜRaegisなのか？",
      subtitle: "AI開発は、温度0.0を超えると「ブラックボックス」になりがちです。Raegisは、すべてのAIエンジニアが必要とする「信頼性曲線」を提供します。",
      items: [
        { title: "破裂点を見つける", desc: "モデルがいつ理性を失い始めるかを正確に把握します。" },
        { title: "RAGの完全性を監査する", desc: "検索パイプラインにどれだけの「ノイズ」が混入しているかを定量化します。" },
        { title: "隠れた異常を検出する", desc: "ユーザーが気づく前に、非決定論的な幻覚を特定します。" },
        { title: "ファインチューニングのためのMLOps", desc: "トレーニング後にモデルが「過学習」または「不安定化」した場合、Raegisはどこが悪かったのかを正確に示します。" }
      ]
    },
    coreFeatures: {
      title: "主な機能",
      items: [
        { title: "Streamlitビジュアルダッシュボード", desc: "モデルの行動ヒートマップと境界をリアルタイムで追跡します。", tooltip: "モデル監査とストレステスト可視化のためのインタラクティブUI。" },
        { title: "アンカーテスト（RAG検証）", desc: "提供されたアンカーコンテキストに対するモデル出力の意味的忠実度（埋め込みによるコサイン類似度）を測定します。", tooltip: "RAG出力がソースコンテキストから逸脱しないことを保証します。" },
        { title: "ホワイトボックスインスペクター", desc: "直接的なlogprobs API（Ollama）またはモデルテンソル（HuggingFace transformers）を使用して真のトークンレベルのエントロピーを抽出し、ブラックボックス行動推論よりも100倍速いインサイトを提供します。", tooltip: "専門家や研究者のための深いニューラル検査。" },
        { title: "前後比較器", desc: "ファインチューニング検証のための究極のMLOpsツール。信頼性デルタとパーソナリティドリフトを計算します。", tooltip: "回帰テストとドリフト検出に不可欠です。" },
        { title: "ガーディアン（ニューラルオートエンコーダー）", desc: "TensorFlow/Keras（軽量なフォールバックとしてScikit-Learnを使用）を使用して、高温出力の異常を検出します。", tooltip: "高温の確率的出力のためのリアルタイムセーフティレイヤー。" }
      ]
    },
    installation: {
      title: "インストール",
      subtitle: "Raegisは、軽量またはヘビーデューティな環境に合わせて、オプションのエクストラを備えた依存関係層を提供します。",
      clone: "リポジトリをクローン"
    },
    apiUsage: {
      title: "Python APIの使用法",
      sections: [
        { title: "1. 行動診断", desc: "0.0から1.5までの監査を行い、温度ごとにN個のサンプルを生成します", tooltip: "温度ランプにわたる自動安定性プロファイリング。" },
        { title: "2. アンカーテスト（RAG検証）", desc: "モデルの出力と取得されたグラウンドトゥルースの間の忠実度を測定します。", tooltip: "RAGパイプラインの意味的忠実度チェック。" },
        { title: "3. ファインチューニング検証", desc: "6時間のLoRAトレーニングの後、ベースモデルが大幅に劣化しましたか？", tooltip: "ファインチューニング後のパフォーマンス低下と過学習を検出します。" },
        { title: "4. ホワイトボックス / グレーボックスインスペクター", desc: "複数のテキスト応答を生成して比較する（ブラックボックス推論）代わりに、インスペクターは1回のフォワードパスでLLMの内部トークン確率に直接アクセスします。", tooltip: "100倍速い監査のためのトークン確率への直接アクセス。" }
      ]
    },
    jsUsage: {
      title: "JavaScript / Node.js API",
      sections: [
        { title: "1. ネイティブ移植", desc: "Pythonに依存しないネイティブTypeScript実装。", tooltip: "軽量で高性能。" },
        { title: "2. TensorFlow.js 統合", desc: "ブラウザまたはNode.jsで直接ニューラル異常検出を実行します。", tooltip: "TF.jsによるハードウェア加速監査。" },
        { title: "3. Raegis Server", desc: "GemmaやLlamaのデモ用にスタンドアロンのREST APIとして実行します。", tooltip: "すぐに使えるバックエンドサービス。" }
      ]
    },
    architecture: {
      title: "オープンソースアーキテクチャ",
      items: [
        "python/raegis/drift/ ドリフトモニタリングモジュール",
        "python/raegis/core/doctor.py gemini真実アンカー",
        "javascript/src/raegis/ Raegis-JSオブザーバー&ブリッジ",
        "python/raegis/stress_test.py 敵対的ベンチマーク"
      ]
    },
    changelog: {
      title: "Changelog",
      items: [
        { 
          version: "2.0.0", 
          date: "2026-03-29", 
          desc: "The Diagnostic Overhaul: Drift, SHAP, Stress Test, Truth Anchor.",
          snippet: "from raegis.drift import DriftMonitor"
        },
        { 
          version: "1.0.0", 
          date: "2026-03-25", 
          desc: "Initial dual-core release (Python + JS Support).",
          snippet: "const auditor = new Raegis.Auditor();"
        }
      ]
    },
    contact: {
      title: "お問い合わせ",
      name: "名前",
      email: "メール",
      message: "メッセージ",
      submit: "メッセージを送信",
      success: "メッセージが正常に送信されました！"
    },
    footer: {
      builtBy: "Lucas Frischeisen による開発"
    }
  }
};
