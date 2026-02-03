// MyFormPage.tsx - 渲染页面组件
// 这个文件导入 formConfig，并传给 DynamicForm 组件进行渲染

import React, { useState, useEffect } from 'react';
import { DynamicForm } from './Dynamicform';
import { 
  contactFormConfig, 
  japaneseRegistrationConfig,
  createSurveyConfig 
} from '../../ts/FormConfig';

/**
 * ========================================
 * 示例1: 联系表单页面
 * ========================================
 */
export const ContactFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            お問い合わせフォーム
          </h1>
          
          {/* 直接使用配置 */}
          <DynamicForm config={contactFormConfig} />
        </div>
      </div>
    </div>
  );
};

/**
 * ========================================
 * 示例2: 日本式会员注册页面
 * ========================================
 */
export const RegistrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            会員登録
          </h1>
          
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ※ すべての必須項目（<span className="text-red-500">*</span>）を入力してください
            </p>
          </div>
          
          {/* 使用日本式注册表单配置 */}
          <DynamicForm config={japaneseRegistrationConfig} />
        </div>
      </div>
    </div>
  );
};

/**
 * ========================================
 * 示例3: 调查问卷页面（从API获取配置）
 * ========================================
 */
export const SurveyPage: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 从API获取问卷配置
    const fetchSurveyData = async () => {
      try {
        const response = await fetch('/api/survey/123');
        const data = await response.json();
        
        // 将API数据转换为表单配置
        const formConfig = createSurveyConfig(data);
        setConfig(formConfig);
      } catch (err) {
        setError('アンケートの読み込みに失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            顧客満足度調査
          </h1>
          
          {/* 使用从API获取的配置 */}
          {config && <DynamicForm config={config} />}
        </div>
      </div>
    </div>
  );
};

/**
 * ========================================
 * 主App组件 - 展示不同的表单
 * ========================================
 */
export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'contact' | 'registration' | 'survey'>('contact');

  const renderPage = () => {
    switch (currentPage) {
      case 'contact':
        return <ContactFormPage />;
      case 'registration':
        return <RegistrationPage />;
      case 'survey':
        return <SurveyPage />;
      default:
        return <ContactFormPage />;
    }
  };

  return (
    <div>
      {/* 导航菜单 */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center gap-4 py-4">
            <button
              onClick={() => setCurrentPage('contact')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                currentPage === 'contact'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              お問い合わせ
            </button>
            <button
              onClick={() => setCurrentPage('registration')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                currentPage === 'registration'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              会員登録
            </button>
            <button
              onClick={() => setCurrentPage('survey')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                currentPage === 'survey'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              アンケート
            </button>
          </div>
        </div>
      </nav>

      {/* 当前页面 */}
      {renderPage()}
    </div>
  );
};

export default App;