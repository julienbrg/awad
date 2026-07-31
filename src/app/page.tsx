'use client'

import { Text, VStack, HStack, Box, Heading } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { useW3PK } from '@/context/W3PK'
import { useTranslation } from '@/hooks/useTranslation'
import { useState, useEffect, useRef } from 'react'
import { toaster } from '@/components/ui/toaster'

const shimmerStyles = `
  @keyframes colorWave {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .shimmer-text {
    background: linear-gradient(120deg, #3182ce 0%, #ffffff 25%, #805ad5 50%, #ffffff 75%, #3182ce 100%);
    background-size: 400% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: colorWave 10s ease-in-out infinite;
  }
`

export default function Home() {
  const { isAuthenticated, user, login, signMessage, deriveWallet, getAddress } = useW3PK()
  const t = useTranslation()
  const [primaryAddress, setPrimaryAddress] = useState<string>('')
  const [mainAddress, setMainAddress] = useState<string>('')
  const [openbarAddress, setOpenbarAddress] = useState<string>('')
  const [isLoadingMain, setIsLoadingMain] = useState(false)
  const [words, setWords] = useState<string[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadAddresses = async () => {
      if (!isAuthenticated || !user) {
        return
      }

      try {
        // Load MAIN address
        if (!mainAddress) {
          setIsLoadingMain(true)
          const mainWallet = await deriveWallet('STANDARD', 'MAIN')
          if (cancelled) return
          setMainAddress(mainWallet.address)
          setIsLoadingMain(false)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load addresses:', error)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMain(false)
        }
      }
    }

    loadAddresses()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user, mainAddress, openbarAddress, primaryAddress, deriveWallet, getAddress])

  const handleNewWord = async () => {
    const startTime = performance.now()

    try {
      const response = await fetch('/api/word', { method: 'POST' })
      const data = await response.json()
      const content = data.choices?.[0]?.message?.content ?? '[]'
      const jsonText = content.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonText)
      setWords(Array.isArray(parsed) ? parsed : [])
      setWordIndex(0)

      const durationSeconds = (performance.now() - startTime) / 1000
      toaster.create({
        title: 'Request completed',
        description: `Total duration: ${durationSeconds.toFixed(2)}s`,
        type: 'info',
        duration: 2000,
      })
    } catch (error) {
      console.error('Failed to fetch new word:', error)
    }
  }

  const SWIPE_THRESHOLD = 50

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.clientX - touchStartX.current
    touchStartX.current = null

    if (deltaX > SWIPE_THRESHOLD) {
      handleNextWord()
    } else if (deltaX < -SWIPE_THRESHOLD) {
      handlePreviousWord()
    }
  }

  const handleNextWord = () => {
    setWordIndex(i => Math.min(i + 1, words.length - 1))
  }

  const handlePreviousWord = () => {
    setWordIndex(i => Math.max(i - 1, 0))
  }

  const handleSignMessage = async (addressType: string, address: string) => {
    const message = `Sign this message from ${addressType} address: ${address}`

    try {
      const signature = await signMessage(message)
      if (signature) {
        toaster.create({
          title: 'Message Signed',
          description: `Signature: ${signature.substring(0, 20)}...`,
          type: 'success',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Failed to sign message:', error)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <VStack gap={8} align="stretch" py={10}>
        <Box p={6} borderRadius="md" textAlign="center">
          {isAuthenticated ? (
            <>
              <Heading as="h1" size="xl" mb={4}>
                Un mot par jour
              </Heading>
              <Text mb={6} color="gray.400">
                On en apprend tous les jours !
              </Text>
              <Box h="20px" />
            </>
          ) : (
            <>
              <Heading as="h1" size="xl" mb={4}>
                Un mot par jour
              </Heading>
              <Text mb={6} color="gray.400">
                On en apprend tous les jours !
              </Text>
              <Box h="20px" />
            </>
          )}
        </Box>

        {isAuthenticated && user && (
          <>
            <VStack>
              <Box textAlign="center">
                <Button colorPalette="blue" onClick={handleNewWord} size="sm" mb="10">
                  Go !
                </Button>
              </Box>
              {words.length > 0 && (
                <Box textAlign="center" mb="100px">
                  <Box
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    style={{ touchAction: 'pan-y', userSelect: 'none' }}
                  >
                    <Text whiteSpace="pre-wrap" fontSize="xl">
                      {words[wordIndex]}
                    </Text>
                    <Text mt={2} fontSize="sm" color="gray.400">
                      {wordIndex + 1} / {words.length}
                    </Text>
                  </Box>
                  <HStack mt={20} justify="center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePreviousWord}
                      disabled={wordIndex <= 0}
                    >
                      ← Précédent
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleNextWord}
                      disabled={wordIndex >= words.length - 1}
                    >
                      Suivant →
                    </Button>
                  </HStack>
                </Box>
              )}
            </VStack>
          </>
        )}
      </VStack>
    </>
  )
}
