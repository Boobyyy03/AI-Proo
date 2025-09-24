import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  MessageSquare,
  Star,
  TrendingUp
} from 'lucide-react'

const Interview = ({ 
  user, 
  token, 
  specialization, 
  difficulty, 
  onBack 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [questionCount, setQuestionCount] = useState(0)
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [previousQuestions, setPreviousQuestions] = useState([])

  useEffect(() => {
    startInterview()
  }, [])

  const startInterview = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/start_interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          specialization,
          difficulty,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setCurrentQuestion(data.question)
        setSessionId(data.session_id)
        setQuestionCount(1)
      } else {
        alert('Lỗi: ' + data.error)
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Vui lòng nhập câu trả lời')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/save_result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          question: currentQuestion,
          user_answer: userAnswer,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setEvaluation(data)
        setShowEvaluation(true)
        
        // Lưu câu hỏi và câu trả lời vào lịch sử
        setPreviousQuestions(prev => [...prev, {
          question: currentQuestion,
          answer: userAnswer,
          evaluation: data
        }])
      } else {
        alert('Lỗi: ' + data.error)
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const getNextQuestion = async () => {
    setLoading(true)
    setShowEvaluation(false)
    setUserAnswer('')
    
    try {
      const previousContext = previousQuestions.map(q => q.question).join('; ')
      
      const response = await fetch('/api/get_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          specialization,
          difficulty,
          previous_questions_context: previousContext,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setCurrentQuestion(data.question)
        setQuestionCount(prev => prev + 1)
        setEvaluation(null)
      } else {
        alert('Lỗi: ' + data.error)
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score) => {
    if (score >= 8) return CheckCircle
    if (score >= 6) return Clock
    return XCircle
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Phỏng vấn {specialization}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary">Câu {questionCount}</Badge>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor(difficulty)}`}></div>
                    <span className="text-sm text-gray-600 capitalize">{difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Current Question */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Câu hỏi {questionCount}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && !currentQuestion ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                  <span>Đang tạo câu hỏi...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">{currentQuestion}</p>
                  </div>
                  
                  {!showEvaluation && (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Nhập câu trả lời của bạn..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                      <Button 
                        onClick={submitAnswer} 
                        disabled={loading || !userAnswer.trim()}
                        className="w-full sm:w-auto"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            Đang đánh giá...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Gửi câu trả lời
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evaluation Results */}
          {showEvaluation && evaluation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Đánh giá</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Điểm số:</span>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const ScoreIcon = getScoreIcon(evaluation.score || 0)
                      return <ScoreIcon className={`h-5 w-5 ${getScoreColor(evaluation.score || 0)}`} />
                    })()}
                    <span className={`text-lg font-bold ${getScoreColor(evaluation.score || 0)}`}>
                      {evaluation.score || 0}/10
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Tiến độ:</span>
                  <Progress value={(evaluation.score || 0) * 10} className="h-2" />
                </div>

                {evaluation.feedback && (
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Phản hồi:</strong> {evaluation.feedback}
                    </AlertDescription>
                  </Alert>
                )}

                {evaluation.suggestions && (
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Gợi ý cải thiện:</strong> {evaluation.suggestions}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button onClick={getNextQuestion} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Đang tạo...
                      </>
                    ) : (
                      'Câu hỏi tiếp theo'
                    )}
                  </Button>
                  <Button variant="outline" onClick={onBack}>
                    Kết thúc phỏng vấn
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Previous Questions Summary */}
          {previousQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lịch sử câu hỏi</CardTitle>
                <CardDescription>
                  Tổng quan về {previousQuestions.length} câu hỏi đã trả lời
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {previousQuestions.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Câu {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const ScoreIcon = getScoreIcon(item.evaluation?.score || 0)
                            return <ScoreIcon className={`h-4 w-4 ${getScoreColor(item.evaluation?.score || 0)}`} />
                          })()}
                          <span className={`text-sm font-medium ${getScoreColor(item.evaluation?.score || 0)}`}>
                            {item.evaluation?.score || 0}/10
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Interview

