"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X, Upload, Send, RefreshCw } from "lucide-react";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { addPost } from "@lib/redux/slices/posts/postSlice";
import { useRouter } from "next/navigation";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import { fetchPostsFromDoctor } from "@lib/redux/slices/doctorprofile/doctorProfileSlice";
import Image from "next/image";

export default function AddPage() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.Auth.usersData.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dispatch(getAuthUserData());
  }, [dispatch]);

  const handlePhotoUpload = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const resetPhoto = () => {
    setImage(null);
    setPhotoPreview(null);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && image) {
      const postData = { title, description, image };

      await dispatch(addPost(postData));
      setTimeout(() => {
        router.push(`/dashboard/doctor/${userId}`);
      }, 0);
      await dispatch(fetchPostsFromDoctor(userId));
    } else {
      alert("Все поля обязательны");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Создать новую публикацию</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="photo" className="block text-sm font-medium">
            Фото
          </label>
          <div className="flex items-center justify-center w-full relative">
            {photoPreview ? (
              <>
                <Image
                  src={photoPreview}
                  width={672}
                  height={256}
                  alt="Предпросмотр загрузки"
                  className="max-w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="sm"
                  className="absolute top-[-40px] right-2"
                  onClick={resetPhoto}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Сбросить фото
                </Button>
              </>
            ) : (
              <label
                htmlFor="photo-upload"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                  isDragging ? "border-blue-500 bg-blue-50" : ""
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Нажмите для загрузки</span>{" "}
                    или перетащите файл
                  </p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePhotoUpload(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                />
              </label>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Заголовок
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите заголовок публикации"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Описание
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание публикации"
            rows={4}
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={() => router.push(`/dashboard/doctor/${userId}`)}
          >
            Отмена
          </Button>
          <Button type="submit">
            <Send className="w-4 h-4 mr-2" />
            Опубликовать
          </Button>
        </div>
      </form>
    </div>
  );
}
