import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatIDR } from '@/lib/utils'
import type { CalculationResult } from '@/types/wishlist'
import { SavingsDialog } from './SavingsDialog'
import {
  Wallet,
  PiggyBank,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Pencil,
} from 'lucide-react'

interface FinancialSummaryProps {
  savings: number
  calculations: CalculationResult
  totalItemCount: number
  onUpdateSavings: (amount: number) => void
}

export function FinancialSummary({
  savings,
  calculations,
  totalItemCount,
  onUpdateSavings,
}: FinancialSummaryProps) {
  const [savingsDialogOpen, setSavingsDialogOpen] = React.useState(false)

  const {
    totalPrice,
    completedPrice,
    remainingPrice,
    shortage,
    progress,
    isAllCompleted,
    isFundSufficient,
  } = calculations

  return (
    <section className="space-y-4" aria-label="Ringkasan Finansial">
      {/* Status banner */}
      <div
        role="status"
        className={`p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
          isAllCompleted
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : isFundSufficient
              ? 'bg-emerald-950/25 border-emerald-500/20 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isAllCompleted ? (
            <Sparkles className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : isFundSufficient ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          )}

          <div>
            <p className="text-sm font-semibold">
              {totalItemCount === 0
                ? 'Belum ada item wishlist.'
                : isAllCompleted
                  ? 'Semua wishlist sudah terpenuhi 🎉'
                  : isFundSufficient
                    ? 'Dana cukup untuk wishlist yang tersisa.'
                    : `Masih membutuhkan ${formatIDR(shortage)} lagi.`}
            </p>
            <p className="text-xs opacity-80">
              {totalItemCount === 0
                ? 'Mulai tambahkan barang impianmu.'
                : isAllCompleted
                  ? 'Selamat! Seluruh target belanjaan kamu telah tercapai.'
                  : isFundSufficient
                    ? `Tabungan kamu (${formatIDR(savings)}) mencukupi sisa kebutuhan wishlist.`
                    : `Tabungan saat ini ${formatIDR(savings)}, sisa target ${formatIDR(remainingPrice)}.`}
            </p>
          </div>
        </div>

        <Badge
          variant={
            isAllCompleted
              ? 'success'
              : isFundSufficient
                ? 'success'
                : 'warning'
          }
          className="shrink-0 hidden sm:inline-flex"
        >
          {isAllCompleted
            ? 'Selesai 100%'
            : isFundSufficient
              ? 'Dana Cukup'
              : 'Perlu Menabung'}
        </Badge>
      </div>

      {/* Progress Section */}
      <Card className="bg-card/90">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground flex items-center gap-1.5">
              <span>Progress Pencapaian</span>
              <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-foreground">
                Berdasarkan Nilai
              </span>
            </span>
            <span className="font-bold text-foreground text-sm">
              {progress}%
            </span>
          </div>
          <Progress value={progress} aria-label={`Progress wishlist ${progress}%`} />
          <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
            <span>Terpenuhi: {formatIDR(completedPrice)}</span>
            <span>Total: {formatIDR(totalPrice)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Wishlist */}
        <Card className="hover:border-border/80 transition-colors">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Wishlist</span>
              <Wallet className="w-4 h-4 text-muted-foreground/70" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
              {formatIDR(totalPrice)}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {totalItemCount} barang terdaftar
            </p>
          </CardContent>
        </Card>

        {/* Sudah Terpenuhi */}
        <Card className="hover:border-border/80 transition-colors">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Sudah Terpenuhi</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400/80" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-emerald-400 tracking-tight truncate">
              {formatIDR(completedPrice)}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {progress}% dari total
            </p>
          </CardContent>
        </Card>

        {/* Masih Dibutuhkan */}
        <Card className="hover:border-border/80 transition-colors">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Masih Dibutuhkan</span>
              <Clock className="w-4 h-4 text-amber-400/80" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-amber-400 tracking-tight truncate">
              {formatIDR(remainingPrice)}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              Item yang belum dibeli
            </p>
          </CardContent>
        </Card>

        {/* Tabungan Saat Ini */}
        <Card className="border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium text-foreground">Tabungan Saya</span>
              <PiggyBank className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary tracking-tight truncate">
              {formatIDR(savings)}
            </div>
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSavingsDialogOpen(true)}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                Ubah Angka
              </button>
              {shortage > 0 ? (
                <span className="text-[10px] text-destructive font-medium">
                  Kurang {formatIDR(shortage)}
                </span>
              ) : (
                <span className="text-[10px] text-emerald-400 font-medium">
                  Cukup
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <SavingsDialog
        open={savingsDialogOpen}
        onOpenChange={setSavingsDialogOpen}
        currentSavings={savings}
        onSave={onUpdateSavings}
      />
    </section>
  )
}
