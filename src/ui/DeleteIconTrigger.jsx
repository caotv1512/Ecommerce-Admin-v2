import React, { useState } from 'react';
import { Popover, Button } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteIconTrigger = ({ id, onDelete }) => {
  const [visible, setVisible] = useState(false);

  const hide = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(id);
    }
    hide();
  };

  const content = (
    <div style={{ width: 200 }}>
      <p>Are you sure you want to delete this product?</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" onClick={hide} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button className='icon' size="small" type="primary" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title={<span><ExclamationCircleOutlined style={{ marginRight: 8 }} /> Confirm Delete</span>}
      trigger="click"
      visible={visible}
      onVisibleChange={(visible) => setVisible(visible)}
    >
      <Button
        type="text"
        icon={<DeleteOutlined className="icon text-[24px]" />}
        aria-label="Delete product"
      />
    </Popover>
  );
};

export default DeleteIconTrigger;
