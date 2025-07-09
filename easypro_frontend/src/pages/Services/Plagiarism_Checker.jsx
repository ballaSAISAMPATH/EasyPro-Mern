import React, { useState } from 'react';
import { Paperclip, ArrowRight, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import NavBar from '../../components/NavBar';

export default function PlagiarismChecker() {
  const [userPlagiarismText, setUserPlagiarismText] = useState('');
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const allowedFileTypes = ['.pdf', '.doc', '.docx'];

  function formatFileSize(sizeInBytes) {
    if (sizeInBytes < 1024) return sizeInBytes + ' B';
    if (sizeInBytes < 1024 * 1024) return (sizeInBytes / 1024).toFixed(1) + ' KB';
    return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  function handleInputChange(e) {
    setUserPlagiarismText(e.target.value);
    if (e.target.value.trim() !== '') setFile(null);
    setErrorMsg('');
  }

  function handleFileUpload(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const extension = uploadedFile.name.toLowerCase().split('.').pop();
    if (!allowedFileTypes.includes('.' + extension)) {
      setErrorMsg('Only .pdf, .doc, and .docx files are allowed.');
      setFile(null);
      return;
    }

    setFile(uploadedFile);
    setUserPlagiarismText('');
    setErrorMsg('');
  }

  async function handleSubmit() {
    setErrorMsg('');

    const wordCount = getWordCount(userPlagiarismText);
    if (!file && wordCount < 100) {
      setErrorMsg('⚠ Please enter at least 100 words for plagiarism check.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post('http://localhost:5555/easyPro/api/plagiarism', formData);
        setResult(res.data);
        setErrorMsg('✅ File uploaded successfully.');
      } else {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(userPlagiarismText, 180);
        doc.text(lines, 10, 10);

        const blob = doc.output('blob');
        const formData = new FormData();
        formData.append('file', blob, 'text-input.pdf');

        const res = await axios.post('http://localhost:5555/easyPro/api/plagiarism', formData);
        setResult(res.data);
        setErrorMsg('✅ Text converted to PDF and uploaded successfully.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('❌ Error uploading content.');
    } finally {
      setLoading(false);
    }
  }

  const renderSources = (sources) => {
    if (!sources || !Array.isArray(sources)) {
      return <p className="text-gray-600">No sources found</p>;
    }

    return (
      <ul className="space-y-4">
        {sources.map((source, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {typeof source === 'string' ? (
              <span className="text-gray-700">{source}</span>
            ) : (
              <div className="text-gray-700 space-y-2">
                <div><strong>Title:</strong> {source.title || 'N/A'}</div>
                <div>
                  <strong>URL:</strong> {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline ml-2">
                      {source.url}
                    </a>
                  ) : 'N/A'}
                </div>
                <div><strong>Author:</strong> {source.author || 'N/A'}</div>
                <div><strong>Published:</strong> {source.publishedDate || 'N/A'}</div>
                <div><strong>Score:</strong> {source.score || 0}%</div>
                {source.description && (
                  <div><strong>Description:</strong> {source.description}</div>
                )}
                {source.citation && (
                  <div><strong>Citation:</strong> {source.citation}</div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <NavBar />
      <div className="text-center mb-12">
        <div className="text-xl md:text-4xl font-serif text-gray-800 my-14 leading-tight"   >
          PLAGIARISM CHECKER<br />
          <i>~Your words matter. Make them yours.</i>
        </div>

        <div className="bg-[#fffbf7] rounded-3xl text-sm md:text-base shadow-lg p-6 mb-12 max-w-3xl mx-auto">
          <div className="space-y-4">
            {/* Text Area */}
            <div>
              <textarea
                value={userPlagiarismText}
                onChange={handleInputChange}
                disabled={file !== null}
                placeholder="Paste the text or attach a file."
                className="w-full h-32 px-4 pt-6 border border-orange-300 bg-[#fffbf7] rounded-3xl resize-none focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-gray-400 text-gray-800 disabled:opacity-50"
              />
            </div>

            {/* File Preview */}
            {file && (
              <div className="text-left text-gray-700 flex items-center justify-between px-2">
                <div>
                  <strong>Attached:</strong> {file.name} ({formatFileSize(file.size)})
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="text-sm text-left px-2 font-medium text-red-600">{errorMsg}</div>
            )}

            {/* Submit Area */}
            <div className="flex gap-3 justify-between items-center mt-2">
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  disabled={userPlagiarismText.trim().length > 0}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`flex items-center gap-2 bg-cyan-300 hover:bg-cyan-400 text-gray-800 md:px-4 p-2 rounded-lg cursor-pointer transition-colors ${
                    userPlagiarismText.trim().length > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="hidden md:block">Attach Files</span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  loading
                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
              >
                {loading ? 'Processing...' : 'Check Plagiarism'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Loader */}
            {loading && (
              <div className="mt-4 text-sm text-blue-600 font-medium animate-pulse">
                Uploading and checking for plagiarism...
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Plagiarism Check Results</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {result.result?.score || result.score || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Plagiarism Score</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {result.result?.textWordCounts || result.totalNumberOfWords || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Words</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {result.result?.totalPlagiarismWords || result.plagiarismWords || 0}
                  </div>
                  <div className="text-sm text-gray-600">Plagiarized Words</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {result.result?.sourceCounts || (result.sources ? result.sources.length : 0)}
                  </div>
                  <div className="text-sm text-gray-600">Sources Found</div>
                </div>
              </div>

              {result.sources && result.sources.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Sources Found:</h4>
                  {renderSources(result.sources)}
                </div>
              )}

              <details className="mt-6">
                <summary className="text-gray-700 font-medium cursor-pointer hover:text-blue-600 mb-2">
                  View Full Response Details
                </summary>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs text-gray-700 border border-gray-300">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}