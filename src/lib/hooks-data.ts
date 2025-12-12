export interface HookTemplate {
  id: string
  text: string
  hasVariable: boolean
}

export interface HookCategory {
  id: string
  name: string
  emoji: string
  hooks: HookTemplate[]
}

export const viralHooks: HookCategory[] = [
  {
    id: 'learning',
    name: 'Обучение',
    emoji: '📚',
    hooks: [
      { id: 'l1', text: 'Как [результат] за [время]', hasVariable: true },
      { id: 'l2', text: 'Полный гайд по [тема]', hasVariable: true },
      { id: 'l3', text: '3 секрета [ниша], о которых молчат', hasVariable: true },
      { id: 'l4', text: '[Число] способов [действие]', hasVariable: true },
      { id: 'l5', text: 'Почему ты до сих пор не [результат]', hasVariable: true },
      { id: 'l6', text: 'Простая система для [цель]', hasVariable: true },
    ]
  },
  {
    id: 'myths',
    name: 'Разрушение мифов',
    emoji: '💥',
    hooks: [
      { id: 'm1', text: 'Вам врали про [тема]', hasVariable: true },
      { id: 'm2', text: 'Почему [популярный метод] не работает', hasVariable: true },
      { id: 'm3', text: 'Забудь про [миф]. Вот правда', hasVariable: true },
      { id: 'm4', text: '[Число] ошибок, которые убивают твой [область]', hasVariable: true },
      { id: 'm5', text: 'Перестань делать это, если хочешь [результат]', hasVariable: true },
    ]
  },
  {
    id: 'personal',
    name: 'Личный опыт',
    emoji: '💡',
    hooks: [
      { id: 'p1', text: 'Как я потерял [что-то] и что понял', hasVariable: true },
      { id: 'p2', text: 'Что я понял к [возраст] годам', hasVariable: true },
      { id: 'p3', text: 'Мой путь от [старт] до [финиш]', hasVariable: true },
      { id: 'p4', text: 'История моего [достижение]', hasVariable: true },
      { id: 'p5', text: 'Я попробовал [метод] — вот результат', hasVariable: true },
    ]
  },
  {
    id: 'lists',
    name: 'Списки',
    emoji: '📋',
    hooks: [
      { id: 'li1', text: '5 книг, которые изменили моё мышление', hasVariable: false },
      { id: 'li2', text: 'Топ-[число] инструментов для [ниша]', hasVariable: true },
      { id: 'li3', text: '[Число] привычек успешных людей', hasVariable: true },
      { id: 'li4', text: 'Мой утренний ритуал (сохрани)', hasVariable: false },
      { id: 'li5', text: '[Число] приложений, которые я использую каждый день', hasVariable: true },
    ]
  },
  {
    id: 'controversial',
    name: 'Провокация',
    emoji: '🔥',
    hooks: [
      { id: 'c1', text: 'Непопулярное мнение: [тезис]', hasVariable: true },
      { id: 'c2', text: 'Хватит [действие]. Это не работает', hasVariable: true },
      { id: 'c3', text: 'Жёсткая правда о [тема]', hasVariable: true },
      { id: 'c4', text: 'То, что тебе не хотят говорить о [ниша]', hasVariable: true },
      { id: 'c5', text: 'Почему [популярная идея] — это миф', hasVariable: true },
    ]
  },
  {
    id: 'results',
    name: 'Результаты',
    emoji: '🏆',
    hooks: [
      { id: 'r1', text: 'От [старт] до [результат] за [время]', hasVariable: true },
      { id: 'r2', text: 'Как я заработал [сумма] на [способ]', hasVariable: true },
      { id: 'r3', text: 'Сделал [действие] — получил [результат]', hasVariable: true },
      { id: 'r4', text: '[Число]x рост за [время]. Как?', hasVariable: true },
      { id: 'r5', text: 'До/После: моя трансформация', hasVariable: false },
    ]
  },
]

export function getRandomHooks(count: number = 5): HookTemplate[] {
  const allHooks = viralHooks.flatMap(cat => cat.hooks)
  const shuffled = [...allHooks].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

