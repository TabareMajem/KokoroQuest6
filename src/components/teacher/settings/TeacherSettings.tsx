```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  Lock, 
  Palette, 
  Globe,
  Calendar,
  Users,
  Save,
  AlertCircle
} from 'lucide-react';

type TeacherSettingsData = {
  notifications: {
    email: boolean;
    inApp: boolean;
    parentUpdates: boolean;
    studentProgress: boolean;
  };
  email: {
    signature: string;
    replyTo: string;
    copyToSelf: boolean;
  };
  calendar: {
    defaultView: 'week' | 'month';
    weekStartsOn: 0 | 1 | 6; // 0 = Sunday, 1 = Monday, 6 = Saturday
    workingHours: {
      start: string;
      end: string;
    };
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    colorScheme: string;
    language: string;
  };
  privacy: {
    showEmail: boolean;
    showProfile: boolean;
    allowMessages: boolean;
  };
};

type Props = {
  settings: TeacherSettingsData;
  onSave: (settings: Partial<TeacherSettingsData>) => Promise<void>;
};

export default function TeacherSettings({ settings, onSave }: Props) {
  const [activeTab, setActiveTab] = useState<keyof TeacherSettingsData>('notifications');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Lock }
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      email: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-purple-600 
                    focus:ring-purple-200"
                />
                <span className="text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.notifications.inApp}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      inApp: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-purple-600 
                    focus:ring-purple-200"
                />
                <span className="text-gray-700">In-app notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.notifications.parentUpdates}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      parentUpdates: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-purple-600 
                    focus:ring-purple-200"
                />
                <span className="text-gray-700">Parent communication updates</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.notifications.studentProgress}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      studentProgress: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-purple-600 
                    focus:ring-purple-200"
                />
                <span className="text-gray-700">Student progress alerts</span>
              </label>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Signature
              </label>
              <textarea
                value={formData.email.signature}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: {
                    ...prev.email,
                    signature: e.target.value
                  }
                }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-purple-200 focus:border-purple-400
                  resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reply-To Email
              </label>
              <input
                type="email"
                value={formData.email.replyTo}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: {
                    ...prev.email,
                    replyTo: e.target.value
                  }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.email.copyToSelf}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: {
                    ...prev.email,
                    copyToSelf: e.target.checked
                  }
                }))}
                className="rounded border-gray-300 text-purple-600 
                  focus:ring-purple-200"
              />
              <span className="text-gray-700">Send copy to myself</span>
            </label>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Calendar Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default View
              </label>
              <select
                value={formData.calendar.defaultView}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  calendar: {
                    ...prev.calendar,
                    defaultView: e.target.value as 'week' | 'month'
                  }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Week Starts On
              </label>
              <select
                value={formData.calendar.weekStartsOn}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  calendar: {
                    ...prev.calendar,
                    weekStartsOn: Number(e.target.value) as 0 | 1 | 6
                  }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Hours Start
                </label>
                <input
                  type="time"
                  value={formData.calendar.workingHours.start}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    calendar: {
                      ...prev.calendar,
                      workingHours: {
                        ...prev.calendar.workingHours,
                        start: e.target.value
                      }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Hours End
                </label>
                <input
                  type="time"
                  value={formData.calendar.workingHours.end}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    calendar: {
                      ...prev.calendar,
                      workingHours: {
                        ...prev.calendar.workingHours,
                        end: e.target.value
                      }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Display Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={formData.display.theme}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  display: {
                    ...prev.display,
                    theme: e.target.value as 'light' | 'dark' | 'system'
                  }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Scheme
              </label>
              <select
                value={formData.display.colorScheme}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  display: {
                    ...prev.display,
                    colorScheme: e.target.value
                  }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              >
                <option value="purple">Purple (Default)</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="pink">Pink</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={formData.display.language}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  display: {
                    ...prev.display,
                    language: e.target.value
                  }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              >
                <option value="en">English</option>
                <option value="ja">Japanese</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.privacy.showEmail}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: {
                      ...prev.privacy,
                      showEmail: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-purple-600 
                    focus:ring-purple-200"
                />
                <span className="text-gray-700">Show email to parents</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.privacy.showProfile}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: {
                      ...prev.privacy,
                      showProfile: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-purple-600 
                    focus:ring-purple-200"
                />
                <span className="text-gray-700">Show profile to other teachers</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.privacy.allowMessages}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: {
                      ...prev.privacy,
                      allowMessages: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-purple-600 
                    focus:ring-purple-200"
                />
                <span className="text-gray-700">Allow direct messages</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4 p-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2
                transition-colors ${
                activeTab === id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {renderTabContent()}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg
              hover:bg-purple-700 transition-colors flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent 
                  rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
```