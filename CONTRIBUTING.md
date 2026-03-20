# Contributing to Raegis 🛡️🔬

Thank you for your interest in contributing to Raegis! We are excited to build the best diagnostic suite for local LLMs, and we welcome contributions of all kinds.

## How to Contribute

### 1. Report Bugs 🐛
If you find a bug, please open an issue on GitHub. Include:
- A clear description of the problem.
- Your OS and Python version.
- Steps to reproduce (e.g., provide the prompt and temperature settings).

### 2. Feature Requests 💡
Have an idea for a new metric or visualization? We'd love to hear it. Open an issue with the [Feature] tag.

### 3. Pull Requests 🚀
1. **Fork** the repository and create your branch from `main`.
2. **Setup local environment**:
   ```bash
   pip install -e .[full]
   ```
3. **Commit your changes**: Use clear, descriptive commit messages in **English**.
4. **Test your code**: If you're adding a new core module, please add a basic test case in `/tests`.
5. **Submit a PR**: Provide a clear summary of what you've changed.

## Development Setup

To run the local dashboard with your changes:
```bash
python -m streamlit run app.py
```

## Contribution Guidelines

- **Language**: All code comments, docstrings, and commit messages should be in **English**.
- **Styles**: We follow PEP8 for Python code.
- **Dependencies**: Avoid adding heavy external libraries unless absolutely necessary.

## Join the Discussion
For major architectural changes, it’s best to discuss them first in a GitHub issue to ensure alignment with the project’s roadmap (**Raegis MLOps goals**).

Thank you for making AI more reliable! 🛡️📊
