import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  User, 
  LogOut, 
  Play, 
  BarChart3, 
  Code, 
  Database, 
  Globe, 
  Smartphone,
  Brain,
  TrendingUp
} from 'lucide-react'

const Dashboard = ({ user, token, onLogout, onStartInterview }) => {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')

  const specializations = [
    { value: 'frontend', label: 'Frontend Development', icon: Globe },
    { value: 'backend', label: 'Backend Development', icon: Database },
    { value: 'fullstack', label: 'Full Stack Development', icon: Code },
    { value: 'mobile', label: 'Mobile Development', icon: Smartphone },
    { value: 'devops', label: 'DevOps', icon: TrendingUp },
    { value: 'ai', label: 'AI/Machine Learning', icon: Brain },
  ]

  const difficulties = [
    { value: 'easy', label: 'Dễ', color: 'bg-green-500' },
    { value: 'medium', label: 'Trung bình', color: 'bg-yellow-500' },
    { value: 'hard', label: 'Khó', color: 'bg-red-500' },
  ]

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/get_progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProgress(data)
      }
    } catch (err) {
      console.error('Error fetching progress:', err)
    }
  }

  const handleStartInterview = async () => {
    if (!selectedSpecialization) {
      alert('Vui lòng chọn chuyên môn')
      return
    }

    setLoading(true)
    try {
      await onStartInterview(selectedSpecialization, selectedDifficulty)
    } finally {
      setLoading(false)
    }
  }

  const getSpecializationIcon = (spec) => {
    const specialization = specializations.find(s => s.value === spec)
    return specialization ? specialization.icon : Code
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ITInterviewPro</h1>
                <p className="text-sm text-gray-500">Hệ thống phỏng vấn IT thông minh</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interview Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-blue-600" />
                  <span>Bắt đầu phỏng vấn mới</span>
                </CardTitle>
                <CardDescription>
                  Chọn chuyên môn và độ khó để bắt đầu phiên phỏng vấn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chuyên môn</label>
                  <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chuyên môn của bạn" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => {
                        const Icon = spec.icon
                        return (
                          <SelectItem key={spec.value} value={spec.value}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{spec.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Độ khó</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff.value} value={diff.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${diff.color}`}></div>
                            <span>{diff.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleStartInterview} 
                  className="w-full" 
                  size="lg"
                  disabled={loading || !selectedSpecialization}
                >
                  {loading ? 'Đang chuẩn bị...' : 'Bắt đầu phỏng vấn'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Progress Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Tiến độ học tập</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progress ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tổng câu hỏi đã trả lời</span>
                        <span className="font-medium">{progress.total_questions || 0}</span>
                      </div>
                      <Progress value={Math.min((progress.total_questions || 0) * 10, 100)} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tỷ lệ trả lời đúng</span>
                        <span className="font-medium">
                          {progress.total_questions > 0 
                            ? Math.round((progress.correct_answers / progress.total_questions) * 100)
                            : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={progress.total_questions > 0 
                          ? (progress.correct_answers / progress.total_questions) * 100 
                          : 0} 
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {progress.total_questions || 0}
                          </div>
                          <div className="text-xs text-gray-500">Câu hỏi</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {progress.correct_answers || 0}
                          </div>
                          <div className="text-xs text-gray-500">Đúng</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có dữ liệu tiến độ</p>
                    <p className="text-sm text-gray-400">Bắt đầu phỏng vấn để xem tiến độ</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gợi ý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      Hệ thống sử dụng AI để tạo câu hỏi phù hợp với trình độ của bạn
                    </AlertDescription>
                  </Alert>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Trả lời chi tiết để nhận đánh giá tốt hơn</p>
                    <p>• Thực hành thường xuyên để cải thiện kỹ năng</p>
                    <p>• Xem lại phản hồi để học hỏi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

