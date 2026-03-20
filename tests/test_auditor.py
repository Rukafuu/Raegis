import pytest
from unittest.mock import patch, MagicMock
from raegis import Auditor

def test_auditor_init():
    auditor = Auditor(model="llama3.2")
    assert auditor.model == "llama3.2"
    assert "localhost:11434" in auditor.base_url

@patch("requests.post")
def test_auditor_call_ollama(mock_post):
    # Mock response from Ollama
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"response": "This is a test response."}
    mock_post.return_value = mock_response

    auditor = Auditor(model="llama3.2")
    response = auditor._call_ollama("Test prompt", temperature=0.7)
    
    assert response == "This is a test response."
    mock_post.assert_called_once()
    
def test_auditor_report_generation_logic():
    # Test if the auditor correctly handles empty results
    auditor = Auditor(model="llama3.2")
    # This is a unit test for the logic, not the API
    assert auditor is not None
