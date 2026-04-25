'use client'
import { useState, useEffect } from 'react'
import { api } from './api'
import { useAuth } from './store'

export function useProgress() {
  const { user } = useAuth()
  const [stats, setStats] = useState<{
    words_known: number
    words_learning: number
    words_unknown: number
    total_reviewed: number
    streak_days: number
    mastery_percentage: number
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await api.getStats()
      setStats(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [user])

  return { stats, loading, refresh }
}

export function useWordStatus(wordId: number) {
  const { user } = useAuth()
  const [status, setStatus] = useState<'known' | 'learning' | 'unknown' | null>(null)
  const [saving, setSaving] = useState(false)

  const update = async (newStatus: 'known' | 'learning' | 'unknown') => {
    if (!user) return
    setSaving(true)
    try {
      await api.updateProgress(wordId, newStatus)
      setStatus(newStatus)
    } finally {
      setSaving(false)
    }
  }

  return { status, saving, update, setStatus }
}
