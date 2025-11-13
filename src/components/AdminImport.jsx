import { useRef, useState } from 'react'
import { apiPost } from '../lib/api'

export default function AdminImport(){
  const csvRef = useRef()
  const zipRef = useRef()
  const [report,setReport] = useState(null)
  const [loading,setLoading] = useState(false)

  async function submit(e){
    e.preventDefault()
    const form = new FormData()
    if(csvRef.current.files[0]) form.append('csv_file', csvRef.current.files[0])
    if(zipRef.current.files[0]) form.append('assets_zip', zipRef.current.files[0])
    try{
      setLoading(true)
      const res = await apiPost('/api/admin/import-csv', form, true)
      setReport(res)
    }catch(err){ alert('Import failed') }
    finally{ setLoading(false) }
  }

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
      <h3 className="font-medium mb-3">Admin: Import Catalogue</h3>
      <form onSubmit={submit} className="space-y-3">
        <input ref={csvRef} type="file" accept=".csv" className="block" required/>
        <input ref={zipRef} type="file" accept=".zip" className="block"/>
        <button className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm" disabled={loading}>{loading?'Uploading...':'Upload & Import'}</button>
      </form>
      {report && (
        <div className="mt-4 text-sm">
          <p><span className="font-semibold">Created:</span> {report.created}</p>
          {report.errors?.length>0 && (
            <div className="mt-2">
              <p className="font-semibold">Errors</p>
              <ul className="list-disc ml-5">
                {report.errors.map((e,i)=>(<li key={i} className="text-red-600">{e}</li>))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
