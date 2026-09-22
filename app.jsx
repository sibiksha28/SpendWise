import { useState } from 'react'
import {
	ArrowDownRight,
	ArrowUpRight,
	BarChart3,
	Bell,
	ChevronDown,
	CircleHelp,
	Coffee,
	CreditCard,
	LayoutDashboard,
	MoreHorizontal,
	Plus,
	Search,
	Settings,
	ShoppingBag,
	Sparkles,
	Utensils,
	Wallet,
} from 'lucide-react'

const weeklySpend = [42, 68, 54, 81, 59, 88, 63]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const initialTransactions = [
	{ name: 'Whole Foods Market', category: 'Groceries', amount: '-$84.20', date: 'Today, 10:42 AM', icon: ShoppingBag, color: 'mint' },
	{ name: 'Blue Bottle Coffee', category: 'Coffee & drinks', amount: '-$6.50', date: 'Today, 8:15 AM', icon: Coffee, color: 'peach' },
	{ name: 'Spotify Premium', category: 'Subscriptions', amount: '-$11.99', date: 'Yesterday', icon: CreditCard, color: 'lavender' },
]

const categorySpending = [
	{ label: 'Housing', value: '$1,420', budget: '$1,800', percent: 79, color: 'coral' },
	{ label: 'Food & dining', value: '$428', budget: '$600', percent: 71, color: 'yellow' },
	{ label: 'Transport', value: '$186', budget: '$300', percent: 62, color: 'blue' },
]

function MetricCard({ label, value, note, trend, icon: Icon, tone }) {
	return (
		<article className={`metric-card ${tone}`}>
			<div className="metric-heading"><span>{label}</span><Icon size={18} strokeWidth={1.8} /></div>
			<strong>{value}</strong>
			<div className="metric-foot"><span className={trend?.startsWith('+') ? 'positive' : 'muted'}>{trend}</span><span>{note}</span></div>
		</article>
	)
}

function Sidebar({ active, setActive }) {
	const links = [
		{ label: 'Overview', icon: LayoutDashboard },
		{ label: 'Transactions', icon: CreditCard },
		{ label: 'Insights', icon: BarChart3 },
	]
	return (
		<aside className="sidebar">
			<div className="brand"><span className="brand-mark">S</span><span>Spend<span>Wise</span></span></div>
			<nav>
				<p className="nav-label">Workspace</p>
				{links.map(({ label, icon: Icon }) => (
					<button className={`nav-item ${active === label ? 'active' : ''}`} key={label} onClick={() => setActive(label)}>
						<Icon size={18} />{label}
					</button>
				))}
			</nav>
			<div className="sidebar-bottom">
				<div className="tip-card"><Sparkles size={18} /><div><strong>Small steps add up</strong><p>You&apos;re 18% under budget this month.</p></div></div>
				<button className="nav-item"><Settings size={18} />Settings</button>
				<button className="nav-item"><CircleHelp size={18} />Help center</button>
				<div className="profile"><div className="avatar">AS</div><div><strong>Alex Smith</strong><span>Personal account</span></div><MoreHorizontal size={18} /></div>
			</div>
		</aside>
	)
}

function SpendingChart() {
	return (
		<section className="panel chart-panel">
			<div className="panel-header"><div><p className="eyebrow">Spending pulse</p><h2>This week</h2></div><button className="select-button">Last 7 days <ChevronDown size={15} /></button></div>
			<div className="chart-summary"><strong>$412.80</strong><span className="positive"><ArrowDownRight size={15} /> 12.4% <small>vs last week</small></span></div>
			<div className="chart">
				<div className="grid-lines"><span>$100</span><span>$75</span><span>$50</span><span>$25</span><span>$0</span></div>
				<div className="bars">{weeklySpend.map((height, index) => <div className="bar-column" key={days[index]}><div className={`bar ${index === 5 ? 'highlight' : ''}`} style={{ height: `${height}%` }}><span>${index === 5 ? '88' : height}</span></div><small>{days[index]}</small></div>)}</div>
			</div>
		</section>
	)
}

function CategoryBreakdown() {
	return <section className="panel category-panel"><div className="panel-header"><div><p className="eyebrow">Where it goes</p><h2>Top categories</h2></div><button className="icon-button" aria-label="More category options"><MoreHorizontal size={19} /></button></div><div className="category-list">{categorySpending.map((item) => <div className="category-row" key={item.label}><div className={`category-icon ${item.color}`}>{item.label === 'Housing' ? <Wallet size={17} /> : item.label === 'Food & dining' ? <Utensils size={17} /> : <ArrowUpRight size={17} />}</div><div className="category-info"><div><span>{item.label}</span><strong>{item.value} <small>of {item.budget}</small></strong></div><div className="progress"><span className={item.color} style={{ width: `${item.percent}%` }} /></div></div></div>)}</div><button className="text-button">View all categories <ArrowUpRight size={15} /></button></section>
}

function Transactions({ transactions }) {
	return <section className="panel transactions-panel"><div className="panel-header"><div><p className="eyebrow">Your money trail</p><h2>Recent transactions</h2></div><button className="text-button">View all <ArrowUpRight size={15} /></button></div><div className="transaction-list">{transactions.map((transaction) => { const Icon = transaction.icon; return <div className="transaction" key={`${transaction.name}-${transaction.amount}`}><div className={`transaction-icon ${transaction.color}`}><Icon size={17} /></div><div className="transaction-name"><strong>{transaction.name}</strong><span>{transaction.category} · {transaction.date}</span></div><strong className="amount">{transaction.amount}</strong></div> })}</div></section>
}

export default function App() {
	const [active, setActive] = useState('Overview')
	const [transactions, setTransactions] = useState(initialTransactions)
	const [showComposer, setShowComposer] = useState(false)
	const [expense, setExpense] = useState('')

	function addExpense(event) {
		event.preventDefault()
		if (!expense.trim()) return
		setTransactions([{ name: expense, category: 'New expense', amount: '-$24.00', date: 'Just now', icon: CreditCard, color: 'blue' }, ...transactions])
		setExpense('')
		setShowComposer(false)
	}

	return <div className="app-shell"><Sidebar active={active} setActive={setActive} /><main className="main-content"><header className="topbar"><div className="breadcrumb"><span>Personal account</span><span>/</span><strong>{active}</strong></div><div className="topbar-actions"><button className="search-button"><Search size={18} /><span>Search anything</span><kbd>⌘ K</kbd></button><button className="bell-button" aria-label="Notifications"><Bell size={19} /><i /></button><div className="mini-avatar">AS</div></div></header><div className="content-wrap"><section className="welcome-row"><div><p className="eyebrow">Tuesday, September 22, 2026</p><h1>Good morning, Alex <span>✦</span></h1><p className="subheading">Here&apos;s your financial picture at a glance.</p></div><button className="primary-button" onClick={() => setShowComposer(true)}><Plus size={18} /> Add expense</button></section><section className="metrics-grid"><MetricCard label="Total balance" value="$12,842.60" note="Across all accounts" trend="+$248.20" icon={Wallet} tone="dark" /><MetricCard label="Spent this month" value="$2,486.40" note="of $3,200 budget" trend="↓ 8.4%" icon={ArrowDownRight} tone="cream" /><MetricCard label="Saved this month" value="$1,640.00" note="Goal: $2,000" trend="+16.2%" icon={Sparkles} tone="yellow" /></section><div className="dashboard-grid"><SpendingChart /><CategoryBreakdown /><Transactions transactions={transactions} /></div></div></main>{showComposer && <div className="modal-backdrop" onClick={() => setShowComposer(false)}><form className="composer" onSubmit={addExpense} onClick={(event) => event.stopPropagation()}><div className="panel-header"><div><p className="eyebrow">Quick capture</p><h2>Add an expense</h2></div><button type="button" className="icon-button" onClick={() => setShowComposer(false)}>×</button></div><label htmlFor="expense-name">What did you spend on?</label><input id="expense-name" autoFocus value={expense} onChange={(event) => setExpense(event.target.value)} placeholder="e.g. Weekend groceries" /><button className="primary-button" type="submit"><Plus size={18} /> Save expense</button></form></div>}</div>
}
