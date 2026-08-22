// 纸模手工拼装指南 (双语支持，干净极简风格)
import React from 'react'
import { X, Scissors, Bookmark, Droplets, CheckCircle2, HelpCircle } from 'lucide-react'
import { useI18n } from '../../i18n'

interface AssemblyGuideProps {
  isOpen: boolean
  onClose: () => void
}

export const AssemblyGuide: React.FC<AssemblyGuideProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in select-none">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden text-zinc-800 dark:text-zinc-100">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2 font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>{t('guide.title')}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto text-xs leading-relaxed">
          {/* 1. 工具准备 */}
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t('guide.sec1Title')}</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="font-semibold mb-0.5 flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {t('guide.toolScissors')}
                </div>
                <p className="text-[11px] opacity-70">{t('guide.toolScissorsDesc')}</p>
              </div>

              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="font-semibold mb-0.5 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  {t('guide.toolCreaser')}
                </div>
                <p className="text-[11px] opacity-70">{t('guide.toolCreaserDesc')}</p>
              </div>

              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="font-semibold mb-0.5 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  {t('guide.toolGlue')}
                </div>
                <p className="text-[11px] opacity-70">{t('guide.toolGlueDesc')}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-xl">
            <span className="font-semibold">{t('guide.paperTitle')}</span>
            <span className="opacity-80">
              {t('guide.paperDesc')}
            </span>
          </div>

          {/* 2. 折痕系统 */}
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t('guide.sec2Title')}</h3>
            <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="w-10 h-0.5 bg-zinc-900 dark:bg-zinc-100"></span>
                <span className="font-medium w-24 shrink-0">{t('guide.lineCut')}</span>
                <span className="opacity-70">{t('guide.lineCutDesc')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-10 h-0.5 border-t border-dashed border-red-500"></span>
                <span className="font-medium text-red-600 dark:text-red-400 w-24 shrink-0">{t('guide.lineMountain')}</span>
                <span className="opacity-70">{t('guide.lineMountainDesc')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-10 h-0.5 border-t border-dotted border-blue-500"></span>
                <span className="font-medium text-blue-600 dark:text-blue-400 w-24 shrink-0">{t('guide.lineValley')}</span>
                <span className="opacity-70">{t('guide.lineValleyDesc')}</span>
              </div>
            </div>
          </div>

          {/* 3. 拼装三步 */}
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t('guide.sec3Title')}</h3>
            <div className="space-y-1.5 opacity-80">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t('guide.step1')}</strong>：{t('guide.step1Desc')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t('guide.step2')}</strong>：{t('guide.step2Desc')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t('guide.step3')}</strong>：{t('guide.step3Desc')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 font-medium rounded-lg text-xs transition-colors"
          >
            {t('common.startCrafting')}
          </button>
        </div>
      </div>
    </div>
  )
}
