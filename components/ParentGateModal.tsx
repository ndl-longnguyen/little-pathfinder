'use client';

import { useState } from 'react';
import { Button } from './Button';

type ParentGateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
};

export function ParentGateModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Khu Vực Dành Cho Phụ Huynh',
}: ParentGateModalProps) {
  const [num1] = useState(() => Math.floor(Math.random() * 5) + 4);
  const [num2] = useState(() => Math.floor(Math.random() * 6) + 3);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const expected = num1 * num2;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (parseInt(answer.trim(), 10) === expected) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setAnswer('');
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="parent-gate-card">
        <div className="parent-gate-icon">🔒</div>
        <h2>{title}</h2>
        <p className="parent-gate-desc">
          Vui lòng giải phép tính sau để xác nhận bạn là người lớn:
        </p>
        <div className="math-challenge">
          {num1} × {num2} = ?
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="parent-gate-answer" className="sr-only">
            Kết quả phép tính
          </label>
          <input
            id="parent-gate-answer"
            type="number"
            inputMode="numeric"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập kết quả"
            className="parent-gate-input"
            aria-label="Kết quả phép tính dành cho phụ huynh"
            autoFocus
          />
          {error && (
            <p className="parent-gate-error">
              Kết quả chưa đúng, vui lòng thử lại nhé!
            </p>
          )}
          <div className="parent-gate-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary">
              Xác nhận
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
