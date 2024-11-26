```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const emailSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  includeProgress: z.boolean().default(true),
  includeActivities: z.boolean().default(true)
});

type EmailFormData = z.infer<typeof emailSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: EmailFormData) => Promise<void>;
  studentName: string;
  parentEmail: string;
};

export default function ParentEmailModal({ 
  isOpen, 
  onClose, 
  onSend,
  studentName,
  parentEmail 
}: Props) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: `Update regarding ${studentName}'s progress`,
      message: '',
      includeProgress: true,
      includeActivities: true
    }
  });

  const handleSendEmail = async (data: EmailFormData) => {
    try {
      setIsSending(true);
      setError(null);
      await onSend(data);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setIsSending(false);
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
            <form onSubmit={handleSubmit(handleSendEmail)}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Email to Parent
                    </h2>
                    <p className="text-sm text-gray-600">
                      Sending to: {parentEmail}
                    </p>
                  </div>
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
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-purple-200 focus:border-purple-400
                      resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register('includeProgress')}
                      className="rounded border-gray-300 text-purple-600 
                        focus:ring-purple-200"
                    />
                    <span className="text-sm text-gray-700">
                      Include progress report
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register('includeActivities')}
                      className="rounded border-gray-300 text-purple-600 
                        focus:ring-purple-200"
                    />
                    <span className="text-sm text-gray-700">
                      Include recommended activities
                    </span>
                  </label>
                </div>
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
                    disabled={isSending}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg
                      hover:bg-purple-700 transition-colors flex items-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent 
                          rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Email
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