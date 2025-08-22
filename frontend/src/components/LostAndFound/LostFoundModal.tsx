import React, { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";

interface LostFoundItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: "lost" | "found" | "returned";
  reportedBy: string;
  dateReported: string;
  image?: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: LostFoundItem | null;
  role: "admin" | "user";
  onUpdateStatus: (id: number, status: LostFoundItem["status"]) => void;
onDelete: (id: number) => void;
}

export const LostFoundModal: React.FC<Props> = ({ isOpen, onClose, item, role, onUpdateStatus, onDelete }) => {
  const [status, setStatus] = useState<LostFoundItem["status"]>("lost");

  useEffect(() => {
    if (item) setStatus(item.status);
  }, [item]);

  if (!item) return null;

  const handleUpdate = () => {
    onUpdateStatus(item.id, status);
    onClose();
  };

    const handleDelete = () => {
        onDelete(item.id);
        onClose();
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Item Details - ID ${item.id}`}>
      {/* ✅ text-gray-800 for readable black text */}
      <div className="space-y-3 text-gray-800">
        <p><strong>Title:</strong> {item.title}</p>
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Location:</strong> {item.location}</p>
        <p><strong>Reported By:</strong> {item.reportedBy}</p>
        <p><strong>Date Reported:</strong> {new Date(item.dateReported).toLocaleString()}</p>
        {item.image && <img src={item.image} alt={item.title} className="w-full max-h-64 object-cover rounded-md" />}

        <div className="space-y-1">
          <p><strong>Status:</strong></p>
          {role === "admin" ? (
            <Select value={status} onValueChange={v => setStatus(v as LostFoundItem["status"])}>
              {/* ✅ use normal black text */}
              <SelectTrigger className="text-gray-800 border-gray-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-800 shadow-lg">
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p>{status}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {role === "admin" && <Button onClick={handleDelete}>Delete</Button>}
        <Button variant="outline" onClick={onClose}>Close</Button>
        {role === "admin" && <Button onClick={handleUpdate}>Update Status</Button>}
      </div>
    </Modal>
  );
};
