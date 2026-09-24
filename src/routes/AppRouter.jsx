import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/presentation/layouts/MainLayout';
import { EditorPage } from '@/presentation/pages/EditorPage';
import { TemplatesPage } from '@/presentation/pages/TemplatesPage';
import { AuditPage } from '@/presentation/pages/AuditPage';
import { NotFoundPage } from '@/presentation/pages/NotFoundPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<EditorPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
