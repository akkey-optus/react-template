// MyFormPage.tsx - 渲染页面组件
// 这个文件导入 formConfig，并传给 DynamicForm 组件进行渲染

import React, { useState} from 'react';
import { DynamicForm } from './Dynamicform';
import {  
  japaneseRegistrationConfig,
} from '../../ts/FormConfig';


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
 * 主App组件 - 展示不同的表单
 * ========================================
 */
export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'contact' | 'registration' | 'survey'>('contact');

  const renderPage = () => {
    switch (currentPage) {
      case 'contact':
        return ;
      case 'registration':
        return <RegistrationPage />;
      case 'survey':
        return ;
      default:
        return <RegistrationPage />;
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