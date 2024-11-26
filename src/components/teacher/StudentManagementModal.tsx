```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Mail, User, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Student } from '../../types/teacher';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  grade: z.string().min(1, 'Grade is required'),
  parentEmail: z.string().email('Invalid parent email address').optional().or(z.literal('')),
  accessCode: z.string().optional()
});

type StudentFormData = z.infer<typeof studentSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: StudentFormData) => Promise<void>;
  student?: Student | null;
};

export default function StudentManagementModal({
  isOpen,
  onClose,
  onSave,
  student
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student ? {
      name: student.name,
      email: student.email,
      grade: student.grade,
      parentEmail: student.parentEmail,
      accessCode: student.accessCode
    } : {
      name: '',
      email: '',
      grade: '',
      parentEmail: '',
      accessCode: ''
    }
  });

  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(data);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
            flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {student ? 'Edit Student' : 'Add Student'}
                  </h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 
                      text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select
                    {...register('grade')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  >
                    <option value="">Select grade</option>
                    {['1st', '2nd', '3rd', '4th', '5th', '6th'].map((grade) => (
                      <option key={grade} value={grade}>{grade} Grade</option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 
                      text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 
                      text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      {...register('parentEmail')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {errors.parentEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.parentEmail.message}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Parent will be invited to connect once student is added
                  </p>
                </div>

                {student && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Code
                    </label>
                    <input
                      type="text"
                      {...register('accessCode')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-purple-200 focus:border-purple-400
                        font-mono"
                      readOnly
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 
                      rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg
                      hover:bg-purple-700 transition-colors flex items-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Student
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```