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
      title: "Raegis: The Stethoscope for Home-Grown LLMs",
      subtitle: "Hallucination, bias, and entropy control for local models using Keras and Scikit-learn. Privacy-first, no paid APIs.",
      ctaRepo: "Access Repository",
      ctaDocs: "Quick Start"
    },
    howItWorks: {
      title: "How it Works",
      steps: [
        {
          title: "Stress Test",
          desc: "Prompt firing while varying model temperature to probe stability boundaries.",
          badge: "INPUT"
        },
        {
          title: "Raegis Guardian",
          desc: "Keras Autoencoder detecting neural anomalies via reconstruction error analysis.",
          badge: "ANALYSIS"
        },
        {
          title: "Semantic Validation",
          desc: "Scikit-learn and Pandas calculating Shannon Entropy and consistency metrics.",
          badge: "METRICS"
        },
        {
          title: "Audited Response",
          desc: "The library blocks hallucinations before they reach the end user.",
          badge: "OUTPUT"
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
      title: "Core Features",
      items: [
        { title: "Streamlit Visual Dashboard", desc: "Track your model's behavioral heatmaps and boundaries in real-time.", tooltip: "Interactive UI for model auditing and stress-test visualization." },
        { title: "Anchor Test (RAG Validation)", desc: "Measures semantic fidelity (cosine similarity via embeddings) of the model's output against a provided anchor context.", tooltip: "Ensures RAG outputs don't drift from source context." },
        { title: "Whitebox Inspector", desc: "Extracts true token-level entropy using direct logprobs APIs (Ollama) or model tensors (HuggingFace transformers), yielding 100x faster insights than blackbox behavioral inference.", tooltip: "Deep neural inspection for expert users and researchers." },
        { title: "Before/After Comparator", desc: "The ultimate MLOps tool for Fine-tuning validation. Calculates the Confidence Delta and the Personality Drift.", tooltip: "Essential for regression testing and drift detection." },
        { title: "Guardian (Neural Autoencoder)", desc: "Detects anomalies in high-temperature outputs using TensorFlow/Keras (with Scikit-Learn as a lightweight fallback).", tooltip: "Real-time safety layer for high-temperature stochastic outputs." }
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
    architecture: {
      title: "Open Source Architecture",
      items: [
        "auditor.py orchestrates asynchronous parallel collection",
        "anchor.py handles RAG evaluation logic",
        "comparator.py performs before/after drift analysis",
        "core/guardian.py trains the unsupervised anomaly autoencoder on-the-fly"
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
      title: "Raegis: O Estetoscópio para LLMs Caseiros",
      subtitle: "Controle de alucinação, viés e entropia para modelos locais usando Keras e Scikit-learn. Privacy-first, sem APIs pagas.",
      ctaRepo: "Acessar Repositório",
      ctaDocs: "Como Começar"
    },
    howItWorks: {
      title: "Como Funciona",
      steps: [
        {
          title: "Stress Test",
          desc: "Disparo de prompts variando a temperatura do modelo para sondar limites de estabilidade.",
          badge: "INPUT"
        },
        {
          title: "Raegis Guardian",
          desc: "Autoencoder (Keras) detectando anomalias neurais via erro de reconstrução.",
          badge: "ANÁLISE"
        },
        {
          title: "Validação Semântica",
          desc: "Scikit-learn e Pandas calculando Entropia de Shannon e métricas de consistência.",
          badge: "MÉTRICAS"
        },
        {
          title: "Resposta Auditada",
          desc: "A lib bloqueia a alucinação antes de chegar ao usuário final.",
          badge: "OUTPUT"
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
      title: "Recursos Principais",
      items: [
        { title: "Dashboard Visual Streamlit", desc: "Acompanhe os heatmaps e limites comportamentais do seu modelo em tempo real.", tooltip: "Interface interativa para auditoria de modelos e visualização de testes de estresse." },
        { title: "Anchor Test (Validação RAG)", desc: "Mede a fidelidade semântica (similaridade de cosseno via embeddings) da saída do modelo em relação a um contexto de âncora fornecido.", tooltip: "Garante que as saídas do RAG não se desviem do contexto de origem." },
        { title: "Inspetor Whitebox", desc: "Extrai a entropia real no nível do token usando APIs diretas de logprobs (Ollama) ou tensores de modelo (HuggingFace transformers), gerando insights 100x mais rápidos do que a inferência comportamental de caixa preta.", tooltip: "Inspeção neural profunda para usuários especialistas e pesquisadores." },
        { title: "Comparador Antes/Depois", desc: "A ferramenta definitiva de MLOps para validação de Fine-tuning. Calcula o Delta de Confiança e o Desvio de Personalidade.", tooltip: "Essencial para testes de regressão e detecção de desvios." },
        { title: "Guardian (Autoencoder Neural)", desc: "Detecta anomalias em saídas de alta temperatura usando TensorFlow/Keras (com Scikit-Learn como um fallback leve).", tooltip: "Camada de segurança em tempo real para saídas estocásticas de alta temperatura." }
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
    architecture: {
      title: "Arquitetura de Código Aberto",
      items: [
        "auditor.py orquestra a coleta paralela assíncrona",
        "anchor.py lida com a lógica de avaliação de RAG",
        "comparator.py realiza análise de desvio antes/depois",
        "core/guardian.py treina o autoencoder de anomalia não supervisionado on-the-fly"
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
        { title: "2. Prueba de Anclaje (Validación RAG)", desc: "Mide la fidelidad entre la salida del modelo y la verdad fundamental recuperada.", tooltip: "Verificación de fidelidad semántica para pipelines RAG." },
        { title: "3. Validación de Fine-tuning", desc: "¿Su modelo base se degradó significativamente después de entrenar ese LoRA de 6 horas?", tooltip: "Detecta caídas de rendimiento y sobreajuste después del ajuste fino." },
        { title: "4. Inspector de caja blanca / caja gris", desc: "En lugar de generar múltiples respuestas de texto e compararlas (inferencia de caja negra), el Inspector accede directamente a las probabilidades de token internas del LLM en una sola pasada.", tooltip: "Acceso directo a las probabilidades de token para una auditoría 100 veces más rápida." }
      ]
    },
    architecture: {
      title: "Arquitectura de Código Aberto",
      items: [
        "auditor.py orquestra la recolección paralela assíncrona",
        "anchor.py maneja la lógica de evaluación de RAG",
        "comparator.py realiza análisis de desvío antes/después",
        "core/guardian.py entrena el autoencoder de anomalías no supervisado sobre la marcha"
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
    architecture: {
      title: "オープンソースアーキテクチャ",
      items: [
        "auditor.py が非同期並列収集をオーケストレートします",
        "anchor.py がRAG評価ロジックを処理します",
        "comparator.py が前後ドリフト分析を実行します",
        "core/guardian.py が監視なしの異常オートエンコーダーをオンザフライでトレーニングします"
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
