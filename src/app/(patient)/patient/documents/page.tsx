"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, Trash2, Download } from "lucide-react";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";

export default function PatientDocumentsPage() {
  const [msg, setMsg] = useState("");
  const [documents, setDocuments] = useState([
    { id: 1, name: "Previous_Lab_Results.pdf", date: "Oct 10, 2026", size: "2.4 MB" },
    { id: 2, name: "ID_Card_Copy.jpg", date: "Oct 01, 2026", size: "1.1 MB" },
  ]);

  const handleUpload = () => {
    setMsg("Document uploaded successfully.");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleDelete = (id: number) => {
    setDocuments(docs => docs.filter(d => d.id !== id));
    setMsg("Document deleted.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Button onClick={handleUpload}>
          <Upload className="w-4 h-4 mr-2" /> Upload Document
        </Button>
      </div>
      
      <AuthSuccessAlert message={msg} />
      
      <div className="grid gap-4">
        {documents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No documents found.
            </CardContent>
          </Card>
        ) : (
          documents.map(doc => (
            <Card key={doc.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <File className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{doc.name}</div>
                    <div className="text-xs text-gray-500">{doc.size} • Uploaded {doc.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
