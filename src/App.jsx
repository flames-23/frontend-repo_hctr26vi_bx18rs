import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiGet, apiPost, apiPut, API_BASE } from './lib/api'
import { ChevronDown, ShoppingCart, User, LogIn, LogOut, Settings } from 'lucide-react'

const SIZES = ['L','XL','XXL']
const SKINS = ['fair','medium','dark']

function useCookie(name) {
  const get = () => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }
  const set = (value, days=365) => {
    const d = new Date(); d.setTime(d.getTime() + days*24*60*60*1000)
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`
  }
  return { get, set }
}

function Header({onOpenSelector, onLogout, authed}){
  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-semibold tracking-tight text-lg">atelier</a>
        <div className="flex items-center gap-3">
          <button onClick={onOpenSelector} className="text-sm px-3 py-1.5 rounded-full border border-neutral-300 hover:border-neutral-800 transition">Find My Fit</button>
          {authed ? (
            <button onClick={onLogout} className="text-sm px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition flex items-center gap-2"><LogOut size={16}/>Logout</button>
          ) : (
            <a href="#login" className="text-sm px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition flex items-center gap-2"><LogIn size={16}/>Login</a>
          )}
          <button className="relative p-2 rounded-full border border-neutral-300 hover:border-neutral-800"><ShoppingCart size={18}/></button>
        </div>
      </div>
    </div>
  )
}

function Hero({onOpenSelector}){
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl tracking-tight font-semibold text-neutral-900">Designer essentials, tailored to you.</h1>
          <p className="mt-4 text-neutral-600 max-w-md">A minimalist boutique with stylist-curated outfits. Set your size and skin tone to see pieces that truly fit.</p>
          <div className="mt-6">
            <button onClick={onOpenSelector} className="px-5 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition">Find My Fit</button>
          </div>
        </div>
        <div className="aspect-square rounded-xl bg-neutral-100 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1500&auto=format&fit=crop" alt="Clean fashion" className="w-full h-full object-cover"/>
        </div>
      </div>
    </section>
  )
}

function SelectorModal({open, onClose, value, onChange, onSave}){
  const [size, setSize] = useState(value.size || 'L')
  const [skin, setSkin] = useState(value.skinTone || 'medium')
  useEffect(()=>{ if(open){ setSize(value.size||'L'); setSkin(value.skinTone||'medium') }},[open])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden></div>
          <motion.div role="dialog" aria-modal="true" className="relative bg-white w-full sm:w-[460px] rounded-t-2xl sm:rounded-2xl p-6 shadow-xl"
            initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}} transition={{duration:0.2}}>
            <h3 className="text-lg font-medium">Personalize your feed</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-neutral-600 mb-2">Size</label>
                <div className="flex gap-2">
                  {SIZES.map(s=> (
                    <button key={s} onClick={()=>setSize(s)} className={`px-3 py-2 rounded-full border transition ${size===s? 'bg-neutral-900 text-white border-neutral-900':'border-neutral-300 hover:border-neutral-800'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-2">Skin tone</label>
                <div className="flex gap-2">
                  {SKINS.map(t=> (
                    <button key={t} onClick={()=>setSkin(t)} className={`px-3 py-2 rounded-full border transition capitalize ${skin===t? 'bg-neutral-900 text-white border-neutral-900':'border-neutral-300 hover:border-neutral-800'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-full border border-neutral-300">Cancel</button>
              <button onClick={()=>onSave({size, skinTone: skin})} className="px-4 py-2 rounded-full bg-neutral-900 text-white">Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ProductCard({p, onAdd, onViewCombo}){
  return (
    <motion.div whileHover={{scale:1.06}} transition={{duration:0.15}} className="group bg-white rounded-xl overflow-hidden border border-neutral-200 focus-within:ring-2 ring-neutral-900">
      <div className="aspect-square overflow-hidden bg-neutral-100">
        <img src={p.images?.[0]?.url} alt={p.images?.[0]?.alt || p.title} className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy"/>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-neutral-900 truncate" title={p.title}>{p.title}</h3>
          <span className="text-neutral-900">${(p.price/100).toFixed(0)}</span>
        </div>
        <p className="mt-1 text-sm text-neutral-500 line-clamp-1">{p.tags?.join(', ')}</p>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={()=>onAdd(p)} className="px-3 py-1.5 rounded-full bg-neutral-900 text-white text-sm">Add to cart</button>
          {p.comboCode && (
            <button onClick={()=>onViewCombo(p)} className="px-3 py-1.5 rounded-full border border-neutral-300 text-sm">View combo</button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function Feed({filters, onAdd, onViewCombo}){
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  const [sort,setSort] = useState('newest')

  useEffect(()=>{ load() },[filters, sort])
  async function load(){
    setLoading(true)
    const qs = new URLSearchParams({ ...(filters.size?{size:filters.size}:{}) , ...(filters.skinTone?{skinTone:filters.skinTone}:{}) , sort }).toString()
    const res = await apiGet(`/api/products?${qs}`)
    setItems(res.items)
    setLoading(false)
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recommended for you</h2>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="border border-neutral-300 rounded-md px-3 py-2 text-sm">
            <option value="newest">Newest</option>
            <option value="trending">Trending</option>
            <option value="price">Price</option>
          </select>
        </div>
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : (
          <motion.div initial="hidden" animate="show" variants={{hidden:{opacity:0,y:6},show:{opacity:1,y:0,transition:{staggerChildren:0.04}}}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(p=> (
              <motion.div key={p.id} variants={{hidden:{opacity:0,y:10},show:{opacity:1,y:0}}}>
                <ProductCard p={p} onAdd={onAdd} onViewCombo={onViewCombo}/>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

function Auth({onAuthed}){
  const [email,setEmail]=useState('admin@example.com')
  const [password,setPassword]=useState('password')
  const [mode,setMode]=useState('login')
  async function submit(e){
    e.preventDefault()
    try{
      let data
      if(mode==='register'){
        data = await apiPost('/api/auth/register',{email,password})
      }else{
        const body = new URLSearchParams()
        body.append('username',email); body.append('password',password)
        data = await apiPost('/api/auth/login', body, true)
      }
      localStorage.setItem('token', data.access_token)
      onAuthed()
    }catch(err){ alert('Auth failed') }
  }
  return (
    <form onSubmit={submit} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-center gap-2">
      <input required value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="email" className="flex-1 bg-white border border-neutral-300 rounded-md px-3 py-2 text-sm"/>
      <input required value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" className="w-36 bg-white border border-neutral-300 rounded-md px-3 py-2 text-sm"/>
      <button className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm">{mode==='login'?'Login':'Register'}</button>
      <button type="button" onClick={()=>setMode(mode==='login'?'register':'login')} className="px-3 py-2 rounded-md border border-neutral-300 text-sm">{mode==='login'?'Need account?':'Have account?'}</button>
    </form>
  )
}

export default function App(){
  const cookie = useCookie('fit')
  const [fit,setFit]=useState(()=>{ try{ return JSON.parse(cookie.get()||'{}') }catch{ return {} } })
  const [selectorOpen,setSelectorOpen]=useState(Object.keys(fit).length===0)
  const [authed,setAuthed]=useState(!!localStorage.getItem('token'))

  async function saveFit(v){
    cookie.set(JSON.stringify(v))
    setFit(v)
    setSelectorOpen(false)
    try{ await apiPut('/api/user/profile', v) }catch{}
  }
  function logout(){ localStorage.removeItem('token'); setAuthed(false) }

  async function addToCart(p){
    try{ await apiPost('/api/cart',{productId:p.id, qty:1}); alert('Added to cart') }catch(err){ if(!authed) alert('Please login to add to cart') }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header onOpenSelector={()=>setSelectorOpen(true)} onLogout={logout} authed={authed}/>
      <Hero onOpenSelector={()=>setSelectorOpen(true)}/>
      {!authed && (
        <div className="mx-auto max-w-6xl px-4 mt-4">
          <Auth onAuthed={()=>setAuthed(true)}/>
        </div>
      )}
      <Feed filters={fit} onAdd={addToCart} onViewCombo={(p)=>alert(`Combo for ${p.title}`)}/>
      <SelectorModal open={selectorOpen} onClose={()=>setSelectorOpen(false)} value={fit} onSave={saveFit}/>
      <footer className="border-t border-neutral-200 mt-8">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500">© {new Date().getFullYear()} atelier</div>
      </footer>
    </div>
  )
}
