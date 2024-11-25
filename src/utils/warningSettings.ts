export interface Warning {
  message: string
  type: 'danger' | 'warning' | 'info'
}

interface ThresholdWarning {
  threshold: number
  message: string
  type: 'danger' | 'warning' | 'info'
}

interface SettingWarnings {
  superLow: ThresholdWarning
  low: ThresholdWarning
  high: ThresholdWarning
  recommendation?: string
  riskPoints: {
    superLow: number
    low: number
    high: number
  }
}

const warnings: Record<string, SettingWarnings> = {
  minWallets: {
    superLow: { 
      threshold: 1, 
      message: 'Слишком низкое количество кошельков. Высокий риск потери всего капитала.', 
      type: 'danger',
    },
    low: { 
      threshold: 3, 
      message: 'Рискованное количество кошельков. Возможны потери при ошибках манипуляции.', 
      type: 'warning'
    },
    high: { 
      threshold: 10, 
      message: 'Слишком много кошельков может усложнить управление Pump-операцией.', 
      type: 'info'
    },
    recommendation: 'Установите минимум 3-5 кошельков для распределения риска и эффективного управления.',
    riskPoints: {
      superLow: 60,
      low: 40,
      high: 15
    }
  },
  minFDV: {
    superLow: { 
      threshold: 10000, 
      message: 'Очень низкий FDV. Высокая вероятность мошенничества или неликвидности.', 
      type: 'danger'
    },
    low: { 
      threshold: 50000, 
      message: 'FDV ниже 50,000 увеличивает риск Pump & Dump схем.', 
      type: 'warning'
    },
    high: { 
      threshold: 200000, 
      message: 'Высокий FDV может ограничить потенциал Pump.', 
      type: 'info'
    },
    recommendation: 'Целевой FDV: 50,000-200,000 для оптимального баланса риска и прибыли.',
    riskPoints: {
      superLow: 50,
      low: 30,
      high: 10
    }
  },
  minPurchaseAmount: {
    superLow: { 
      threshold: 100, 
      message: 'Мизерная сумма. Транзакционные комиссии поглотят возможную прибыль.', 
      type: 'danger'
    },
    low: { 
      threshold: 300, 
      message: 'Малые покупки повышают вероятность сильного слиппеджа.', 
      type: 'warning'
    },
    high: { 
      threshold: 2000, 
      message: 'Крупные покупки могут вызвать резкий рост цены, уменьшая эффективность Pump.', 
      type: 'info'
    },
    recommendation: 'Используйте суммы в диапазоне 300-1000 для сбалансированного влияния на цену.',
    riskPoints: {
      superLow: 45,
      low: 30,
      high: 20
    }
  },
  minLiquidity: {
    superLow: { 
      threshold: 5000, 
      message: 'Крайне низкая ликвидность. Риск невозможности продать токены после Pump.', 
      type: 'danger'
    },
    low: { 
      threshold: 20000, 
      message: 'Низкая ликвидность увеличивает риск манипуляции ценой.', 
      type: 'warning'
    },
    high: { 
      threshold: 100000, 
      message: 'Слишком высокая ликвидность снижает эффективность Pump.', 
      type: 'info'
    },
    recommendation: 'Целевой диапазон ликвидности: 20,000-50,000 для успешного Pump & Dump.',
    riskPoints: {
      superLow: 50,
      low: 35,
      high: 15
    }
  },
  maxTopHolders: {
    superLow: { 
      threshold: 1, 
      message: 'Крайне высокий риск. Один крупный держатель может обрушить цену.', 
      type: 'danger'
    },
    low: { 
      threshold: 5, 
      message: 'Рискованно. Небольшое число держателей увеличивает вероятность манипуляций.', 
      type: 'warning'
    },
    high: { 
      threshold: 15, 
      message: 'Много крупных держателей может усложнить Pump.', 
      type: 'info'
    },
    recommendation: 'Держите максимум крупных держателей в пределах 5-10 для управляемости.',
    riskPoints: {
      superLow: 70,
      low: 50,
      high: 20
    }
  },
  targetMultiplier: {
    superLow: { 
      threshold: 1.1, 
      message: 'Слишком низкий мультипликатор. Прибыль недостаточна для покрытия рисков.', 
      type: 'danger'
    },
    low: { 
      threshold: 1.5, 
      message: 'Минимальная прибыль. Риски всё ещё высоки.', 
      type: 'warning'
    },
    high: { 
      threshold: 10, 
      message: 'Слишком высокий мультипликатор. Достижение цели маловероятно.', 
      type: 'info'
    },
    recommendation: 'Цель 2-4x обеспечит оптимальное соотношение риска и прибыли.',
    riskPoints: {
      superLow: 30,
      low: 20,
      high: 40
    }
  },
  investmentPerToken: {
    superLow: {
      threshold: 100,
      message: 'Слишком малая сумма инвестиций. Комиссии съедят прибыль.',
      type: 'danger'
    },
    low: {
      threshold: 500,
      message: 'Низкая сумма инвестиций может ограничить потенциальную прибыль.',
      type: 'warning'
    },
    high: {
      threshold: 5000,
      message: 'Высокая сумма инвестиций увеличивает риски потерь.',
      type: 'info'
    },
    recommendation: 'Оптимальная сумма инвестиций: 500-2000 на токен.',
    riskPoints: {
      superLow: 40,
      low: 25,
      high: 35
    }
  },
  btcDropThreshold: {
    superLow: {
      threshold: 20,
      message: 'Слишком низкий порог остановки. Частые остановки торговли.',
      type: 'warning'
    },
    low: {
      threshold: 30,
      message: 'Низкий порог может привести к пропуску хороших сделок.',
      type: 'info'
    },
    high: {
      threshold: 70,
      message: 'Высокий порог. Риск серьезных потерь при сильном падении BTC.',
      type: 'danger'
    },
    recommendation: 'Рекомендуемый порог: 40-60% для баланса безопасности и возможностей.',
    riskPoints: {
      superLow: 30,
      low: 20,
      high: 45
    }
  }
}

export function getWarningForSetting(key: string, value: number): Warning | null {
  const setting = warnings[key]
  if (!setting) return null

  if (value <= setting.superLow.threshold) {
    return {
      message: setting.superLow.message,
      type: setting.superLow.type
    }
  } else if (value < setting.low.threshold) {
    return {
      message: setting.low.message,
      type: setting.low.type
    }
  } else if (value > setting.high.threshold) {
    return {
      message: setting.high.message,
      type: setting.high.type
    }
  }

  return null
}

export function calculateTotalRiskPoints(settings: Record<string, number>): number {
  let totalPoints = 0

  Object.entries(settings).forEach(([key, value]) => {
    const setting = warnings[key]
    if (!setting?.riskPoints) return

    if (value <= setting.superLow.threshold) {
      totalPoints += setting.riskPoints.superLow
    } else if (value < setting.low.threshold) {
      totalPoints += setting.riskPoints.low
    } else if (value > setting.high.threshold) {
      totalPoints += setting.riskPoints.high
    }
  })

  return totalPoints
}

export function getRiskLevel(points: number) {
  if (points <= 50) {
    return {
      level: 'Low',
      color: 'text-green-600 dark:text-green-400'
    }
  } else if (points <= 100) {
    return {
      level: 'Medium',
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  } else if (points <= 150) {
    return {
      level: 'High',
      color: 'text-orange-600 dark:text-orange-400'
    }
  } else {
    return {
      level: 'Extreme',
      color: 'text-red-600 dark:text-red-400'
    }
  }
}

export function getRecommendationsForSettings(settings: Record<string, number>): string[] {
  const totalRiskPoints = calculateTotalRiskPoints(settings)
  // Only show recommendations if risk level is Medium or higher (> 50 points)
  if (totalRiskPoints <= 50) {
    return []
  }

  const recommendations: string[] = []

  Object.entries(settings).forEach(([key, value]) => {
    const setting = warnings[key]
    if (!setting?.recommendation) return

    const warning = getWarningForSetting(key, value)
    if (warning?.type === 'danger' || warning?.type === 'warning') {
      recommendations.push(setting.recommendation)
    }
  })

  return recommendations
}