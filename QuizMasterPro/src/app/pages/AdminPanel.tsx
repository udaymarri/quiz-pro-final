import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  LayoutDashboard, 
  MessageSquare, 
  Database, 
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { api } from '@/services/api';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const categories = ['programming', 'science', 'history', 'geography', 'math', 'general'];
  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const fetchedQuestions = await api.getQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentQuestion.id) {
        await api.updateQuestion(currentQuestion.id, currentQuestion);
        setFeedback({ message: 'Question updated successfully!', type: 'success' });
      } else {
        await api.addQuestion(currentQuestion);
        setFeedback({ message: 'New question added successfully!', type: 'success' });
      }
      setIsEditing(false);
      setCurrentQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      setFeedback({ message: 'Error saving question.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    setIsLoading(true);
    try {
      await api.deleteQuestion(id);
      setFeedback({ message: 'Question deleted.', type: 'success' });
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      setFeedback({ message: 'Error deleting question.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const openEdit = (question: any = null) => {
    if (question) {
      setCurrentQuestion({ ...question });
    } else {
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        category: 'programming',
        difficulty: 'easy'
      });
    }
    setIsEditing(true);
  };

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={onBack} className="rounded-xl"><ArrowLeft className="w-5 h-5" /></Button>
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 font-medium">Manage your quiz library and content</p>
            </div>
          </div>
          <Button 
            onClick={() => openEdit()}
            className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-xl font-bold text-lg shadow-xl transition-all hover:scale-105"
          >
            <Plus className="mr-2 w-6 h-6" />
            Add Question
          </Button>
        </div>

        <AnimatePresence>
          {feedback.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
                feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-bold">{feedback.message}</span>
              <button onClick={() => setFeedback({message:'', type:''})} className="ml-auto"><X className="w-4 h-4"/></button>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="border-b bg-gray-50/50 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-600" />
                Questions Library
                <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-2">
                  {questions.length} total
                </span>
              </CardTitle>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Search questions or categories..." 
                  className="pl-12 h-12 bg-white rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && !isEditing ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="font-bold text-gray-400">Syncing with Cloud...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Question</th>
                      <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Category</th>
                      <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Difficulty</th>
                      <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="p-6 max-w-md">
                          <p className="font-bold text-gray-800 line-clamp-2">{q.question}</p>
                        </td>
                        <td className="p-6">
                          <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full font-bold text-sm uppercase tracking-tighter">
                            {q.category}
                          </span>
                        </td>
                        <td className="p-6">
                           <span className={`px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-tighter ${
                            q.difficulty === 'hard' ? 'bg-red-100 text-red-600' : 
                            q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                            'bg-green-100 text-green-600'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openEdit(q)}
                              className="w-10 h-10 p-0 rounded-lg hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Edit3 className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(q.id)}
                              className="w-10 h-10 p-0 rounded-lg hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditing(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl"
              >
                <Card className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                  <form onSubmit={handleSave}>
                    <CardHeader className="bg-gray-50 p-8 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-black">
                          {currentQuestion.id ? 'Edit Question' : 'Add New Question'}
                        </CardTitle>
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-full h-10 w-10 p-0">
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-gray-400">Question Text</label>
                        <textarea 
                          className="w-full h-24 p-4 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-lg resize-none"
                          value={currentQuestion.question}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase tracking-widest text-gray-400">Category</label>
                          <select 
                            className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl px-4 font-bold"
                            value={currentQuestion.category}
                            onChange={(e) => setCurrentQuestion({...currentQuestion, category: e.target.value})}
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase tracking-widest text-gray-400">Difficulty</label>
                          <select 
                            className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl px-4 font-bold"
                            value={currentQuestion.difficulty}
                            onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value})}
                          >
                            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-black uppercase tracking-widest text-gray-400">Options (Select Correct)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentQuestion.options.map((opt: string, i: number) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${currentQuestion.correctAnswer === i ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white'}`}>
                              <input 
                                type="radio" 
                                name="correct" 
                                checked={currentQuestion.correctAnswer === i}
                                onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: i})}
                                className="w-5 h-5 text-blue-600"
                              />
                              <input 
                                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                className="flex-1 bg-transparent border-0 focus:ring-0 font-bold"
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...currentQuestion.options];
                                  newOpts[i] = e.target.value;
                                  setCurrentQuestion({...currentQuestion, options: newOpts});
                                }}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t flex gap-4">
                         <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 h-12 rounded-xl font-bold"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : (
                            <>
                              <Save className="mr-2 w-5 h-5" />
                              {currentQuestion.id ? 'Update Question' : 'Save Question'}
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </form>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
