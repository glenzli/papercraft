// OpenAI / GPT Image API Key 与参数配置弹窗
import React, { useState, useEffect } from 'react'
import { X, Key, Check, Save } from 'lucide-react'

interface ApiConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: { apiKey: string; apiBaseUrl: string; modelName: string }) => void
  initialConfig: { apiKey: string; apiBaseUrl: string; modelName: string }
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig
}) => {
  const [apiKey, setApiKey] = useState(initialConfig.apiKey || '')
  const [apiBaseUrl, setApiBaseUrl] = useState(initialConfig.apiBaseUrl || 'https://api.openai.com/v1')
  const [modelName, setModelName] = useState(initialConfig.modelName || 'dall-e-3')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setApiKey(initialConfig.apiKey)
    setApiBaseUrl(initialConfig.apiBaseUrl || 'https://api.openai.com/v1')
    setModelName(initialConfig.modelName || 'dall-e-3')
  }, [initialConfig])

  if (!isOpen) return null

  const handleSave = () => {
    onSave({ apiKey, apiBaseUrl, modelName })
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-slate-100 text-xs">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
            <Key className="w-4 h-4 text-indigo-400" />
            <span>AI 生图 API 接口配置 (GPT Image / DALL-E)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 表单 */}
        <div className="p-6 space-y-4">
          <p className="text-slate-400 leading-relaxed text-[11px]">
            配置您的 OpenAI 或兼容 API Key。若留空，系统将自动使用内置的<strong>智能语义 Mock 引擎</strong>生成涂装。
          </p>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">OpenAI API Key:</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">API Base URL (反代/中转地址):</label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={e => setApiBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">生图模型 (Image Model):</label>
            <select
              value={modelName}
              onChange={e => setModelName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="dall-e-3">DALL-E 3 (画质最高)</option>
              <option value="dall-e-2">DALL-E 2 (快速生成)</option>
              <option value="gpt-image-2">GPT Image 2 (最新)</option>
            </select>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                保存配置
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
