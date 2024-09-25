"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import JSZip from 'jszip';

const PKPassViewer = () => {
  const [pkpassFiles, setPkpassFiles] = useState(null);
  const [pkpassData, setPkpassData] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.pkpass')) {
      try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        const filesList = Object.keys(contents.files);

        // Read pass.json
        const passJson = await contents.file('pass.json').async('string');
        const passData = JSON.parse(passJson);

        // Read thumbnail.png if exists
        if (contents.file('thumbnail.png')) {
          const imgBlob = await contents.file('thumbnail.png').async('blob');
          setThumbnail(URL.createObjectURL(imgBlob));
        }

        setPkpassFiles(filesList);
        setPkpassData(passData);
      } catch (error) {
        console.error('Error processing .pkpass file:', error);
        alert('Error processing .pkpass file');
      }
    } else {
      alert('Please upload a valid .pkpass file');
    }
  };

  const renderPassCard = () => {
    if (!pkpassData) return null;

    return (
      <Card className="w-80 h-128 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">{pkpassData.description}</h2>
          <p>{pkpassData.organizationName}</p>
        </div>
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="font-bold">ΑΚΑΔΗΜΑÏΚΗ ΤΑΥΤΟΤΗΤΑ / ACADEMIC ID</h3>
            <p>ΠΡΟΠΤΥΧΙΑΚΟΣ ΦΟΙΤΗΤΗΣ</p>
          </div>
          <div className="mb-4">
            <p><strong>ΟΝΟΜΑΤΕΠΩΝΥΜΟ:</strong> {pkpassData.generic?.primaryFields?.[0]?.value || 'N/A'}</p>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <p><strong>HM/NIA ΕΓΓΡΑΦΗΣ:</strong></p>
              <p>{pkpassData.generic?.secondaryFields?.[0]?.value || 'N/A'}</p>
            </div>
            <div>
              <p><strong>ΔΕΛΤΙΟ ΕΙΣΙΤΗΡΙΟΥ</strong></p>
              <p><strong>ΙΣΧΥΕΙ ΕΩΣ:</strong> {pkpassData.generic?.secondaryFields?.[1]?.value || 'N/A'}</p>
            </div>
          </div>
          {thumbnail && <img src={thumbnail} alt="Thumbnail" className="w-24 h-24 mx-auto" />}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Input type="file" accept=".pkpass" onChange={handleFileUpload} className="mb-4" />
      <div className="flex gap-4">
        {renderPassCard()}
        {pkpassFiles && (
          <Card className="flex-1">
            <CardContent>
              <h3 className="font-bold mb-2">PKPass Contents:</h3>
              <ul>
                {pkpassFiles.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PKPassViewer;