import React from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const boxStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '90%',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
};

const ApproverModal = ({ open, approver, onClose }) => {
  if (!open) return null;
  const { approved_by_email, approved_by_user_id, approved_at, approval_comments } = approver || {};

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <h3>Approver Details</h3>
        <p><strong>Approver Email / ID:</strong> {approved_by_email || approved_by_user_id || '-'}</p>
        <p><strong>Approved At:</strong> {approved_at ? new Date(approved_at).toLocaleString() : '-'}</p>
        <p><strong>Approval Comments:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: '8px', borderRadius: '4px' }}>{approval_comments || '-'}</p>
        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ApproverModal;
