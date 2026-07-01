import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { resourceService } from '../api/services';

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', resource_id: '', provider: 'aws',
    resource_type: '', region: '', hourly_cost: 0, monthly_cost: 0
  });

  const loadResources = () => {
    resourceService.getAll().then(setResources);
  };

  useEffect(() => { loadResources(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resourceService.create(form);
    setShowForm(false);
    setForm({ name: '', resource_id: '', provider: 'aws', resource_type: '', region: '', hourly_cost: 0, monthly_cost: 0 });
    loadResources();
  };

  const handleDelete = async (id: number) => {
    await resourceService.delete(id);
    loadResources();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cloud Resources</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Resource
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Resource</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border rounded px-3 py-2" required />
              <input placeholder="Resource ID (e.g. i-123456)" value={form.resource_id} onChange={e => setForm({...form, resource_id: e.target.value})} className="border rounded px-3 py-2" required />
              <select value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="border rounded px-3 py-2">
                <option value="aws">AWS</option>
                <option value="azure">Azure</option>
                <option value="gcp">GCP</option>
              </select>
              <input placeholder="Resource Type (e.g. EC2)" value={form.resource_type} onChange={e => setForm({...form, resource_type: e.target.value})} className="border rounded px-3 py-2" required />
              <input placeholder="Region (e.g. us-east-1)" value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="border rounded px-3 py-2" required />
              <input type="number" step="0.001" placeholder="Hourly Cost" value={form.hourly_cost} onChange={e => setForm({...form, hourly_cost: parseFloat(e.target.value)})} className="border rounded px-3 py-2" required />
              <input type="number" step="0.01" placeholder="Monthly Cost" value={form.monthly_cost} onChange={e => setForm({...form, monthly_cost: parseFloat(e.target.value)})} className="border rounded px-3 py-2" required />
              <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">Save Resource</button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-gray-500">Name</th>
                <th className="pb-2 text-gray-500">Provider</th>
                <th className="pb-2 text-gray-500">Type</th>
                <th className="pb-2 text-gray-500">Region</th>
                <th className="pb-2 text-gray-500">Status</th>
                <th className="pb-2 text-gray-500">Monthly Cost</th>
                <th className="pb-2 text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{r.name}</td>
                  <td className="py-3 uppercase">{r.provider}</td>
                  <td className="py-3">{r.resource_type}</td>
                  <td className="py-3">{r.region}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${r.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-red-600">${r.monthly_cost}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
