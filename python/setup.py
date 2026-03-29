from setuptools import setup, find_packages

setup(
    name="raegis",
    version="0.1.1",
    description="A stethoscope for home LLMs - behavioral diagnostics, hallucination detection, and fine-tuning validation.",
    long_description=open("README.md", encoding="utf-8").read() if __import__("os").path.exists("README.md") else "",
    long_description_content_type="text/markdown",
    author="Rukafuu",
    python_requires=">=3.10",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.0",
        "pandas>=1.3.0",
        "numpy>=1.20.0",
        "scikit-learn>=1.0.0",
        "streamlit>=1.20.0",
        "plotly>=5.10.0",
    ],
    extras_require={
        # pip install raegis[neural]
        "neural": [
            "tensorflow>=2.14",
        ],
        # pip install raegis[semantic]
        "semantic": [
            "sentence-transformers>=2.6",
        ],
        # pip install raegis[drift]
        "drift": [
            "evidently==0.4.15",
            "xgboost>=2.0.0",
            "imbalanced-learn>=0.12.0",
            "fastapi>=0.110.0",
            "uvicorn>=0.29.0",
            "pyarrow>=15.0.0",
            "shap>=0.45.0",
            "google-generativeai>=0.5.0",
        ],
        # pip install raegis[full]
        "full": [
            "tensorflow>=2.14",
            "sentence-transformers>=2.6",
            "evidently==0.4.15",
            "xgboost>=2.0.0",
            "imbalanced-learn>=0.12.0",
            "fastapi>=0.110.0",
            "uvicorn>=0.29.0",
        ],
    },
    entry_points={
        "console_scripts": [
            # raegis --model llama3.2 --prompt "..." (Future CLI)
            # "raegis=raegis.cli:main",
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
)
