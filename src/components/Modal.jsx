import React from 'react';
import { createPortal } from 'react-dom';

/**
 * High-performance Portal-based Modal to escape transformed parent containers.
 * Ensures fixed positioning is always relative to the viewport.
 */
export default function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease forwards'
      }}
    >
      <div 
        className="modal animate-fade" 
        style={{ 
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          maxWidth: 'fit-content' // Allows the child to set its own width
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
