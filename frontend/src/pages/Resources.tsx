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
    if (confirm('Delete this resource?')) {
      await resourceService.delete(id);
      loadResources();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Cloud Resources</h1>
            <p className="text-gray-400 mt-1">{resources.length} resources tracked</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            + Add Resource
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Add New Cloud Resource</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input placeholder="Resource Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" required />
              <input placeholder="Resource ID (e.g. i-123456)" value={form.resource_id} onChange={e => setForm({...form, resource_id: e.target.value})} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" required />
              <select value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500">
                <option value="aws">AWS</option>
                <option value="azure">Azure</option>
                <option value="gcp">GCP</option>
              </select>
              <input placeholder="Resource Type (e.g. EC2)" value={form.resource_type} onChange={e => setForm({...form, resource_type: e.target.value})} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" required />
              <input placeholder="Region (e.g. us-east-1)" value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" required />
              <input type="number" step="0.001" placeholder="Hourly Cost ($)" value={form.hourly_cost} onChange={e => setForm({...form, hourly_cost: parseFloat(e.target.value)})} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" required />
              <input type="number" step="0.01" placeholder="Monthly Cost ($)" value={form.monthly_cost} onChange={e => setForm({...form, monthly_cost: parseFloat(e.target.value)})} className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500" required />
              <div className="col-span-2 flex space-x-3">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium">Save Resource</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-700 text-white py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800">
                <th className="px-6 py-4 text-gray-400 font-medium text-sm">Name</th>
                <th className="px-6 py-4 text-gray-400 font-medium text-sm">Provider</th>
                <th className="px-6 py-4 text-gray-400 font-medium text-sm">Type</th>
                <th className="px-6 py-4 text-gray-400 font-medium text-sm">Region</th>
                <th className="px-6 py-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="px-6 py-4 text-gray-400 font-medium text-sm">Monthly Cost</th>
                <th className="px-6 py-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{r.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${r.provider === 'aws' ? 'bg-orange-900 text-orange-300' : r.provider === 'azure' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                      {r.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{r.resource_type}</td>
                  <td className="px-6 py-4 text-gray-300">{r.region}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-red-400">${r.monthly_cost}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
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
