import React from 'react';

interface ImageUploadProps {
  name: string;
  label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name, label }) => (
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
    <input
      type="file"
      name={name}
      accept="image/*"
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
    />
  </div>
);

export default ImageUpload;
