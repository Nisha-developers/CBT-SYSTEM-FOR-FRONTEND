import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  User, 
  Mail, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

// --- MOCK ADMINS DATA ---
const INITIAL_ADMINS = [
  { 
    id: '1', 
    name: 'Joseph philip', 
    email: 'josefsf.phj@school.edu', 
    role: 'Super Admin', 
    status: 'Active', 
    createdAt: 'Sep 15, 2026',
    lastLogin: '2 hours ago'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane.smith@school.edu', 
    role: 'Admin', 
    status: 'Active', 
    createdAt: 'Sep 20, 2026',
    lastLogin: '1 day ago'
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    email: 'michael.brown@school.edu', 
    role: 'Admin', 
    status: 'Active', 
    createdAt: 'Sep 22, 2026',
    lastLogin: '5 hours ago'
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    email: 'emily.davis@school.edu', 
    role: 'Super Admin', 
    status: 'Active', 
    createdAt: 'Sep 10, 2026',
    lastLogin: '3 days ago'
  },
  { 
    id: '5', 
    name: 'David Wilson', 
    email: 'david.wilson@school.edu', 
    role: 'Admin', 
    status: 'Inactive', 
    createdAt: 'Sep 25, 2026',
    lastLogin: '2 weeks ago'
  },
  { 
    id: '6', 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@school.edu', 
    role: 'Admin', 
    status: 'Active', 
    createdAt: 'Sep 18, 2026',
    lastLogin: '30 minutes ago'
  },
];

const Admin = () => {
  // --- STATE ---
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // --- MODAL STATES ---
  const [formModal, setFormModal] = useState({ open: false, mode: 'create', data: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, admin: null });

  // --- FILTERING LOGIC ---
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      // Tab Filter
      if (activeTab === 'admins' && admin.role !== 'Admin') return false;
      if (activeTab === 'super' && admin.role !== 'Super Admin') return false;

      // Search Filter
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        admin.name.toLowerCase().includes(search) ||
        admin.email.toLowerCase().includes(search);

      // Role Filter (dropdown)
      const matchesRole = filterRole ? admin.role === filterRole : true;

      return matchesSearch && matchesRole;
    });
  }, [admins, activeTab, searchTerm, filterRole]);

  const hasActiveFilters = searchTerm || filterRole;

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterRole('');
  };

  // --- CRUD HANDLERS ---
  const handleOpenCreate = () => {
    setFormModal({ open: true, mode: 'create', data: null });
  };

  const handleOpenEdit = (admin) => {
    setFormModal({ open: true, mode: 'edit', data: admin });
  };

  const handleCloseForm = () => {
    setFormModal({ open: false, mode: 'create', data: null });
  };

  const handleSaveAdmin = (formData) => {
    if (formModal.mode === 'create') {
      setAdmins([
        ...admins, 
        { 
          ...formData, 
          id: Date.now().toString(), 
          status: 'Active',
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lastLogin: 'Never'
        }
      ]);
    } else {
      setAdmins(admins.map(a => a.id === formData.id ? { ...a, ...formData } : a));
    }
    handleCloseForm();
  };

  const handleOpenDelete = (admin) => {
    setConfirmModal({ open: true, admin });
  };

  const handleCloseDelete = () => {
    setConfirmModal({ open: false, admin: null });
  };

  const handleConfirmDelete = () => {
    setAdmins(admins.filter(a => a.id !== confirmModal.admin.id));
    handleCloseDelete();
  };

  // --- HELPERS ---
  const getRoleBadge = (role) => {
    return role === 'Super Admin'
      ? 'bg-blue-50 text-blue-700 border-blue-100'
      : 'bg-gray-50 text-gray-700 border-gray-100';
  };

  const getStatusBadge = (status) => {
    return status === 'Active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const getRoleIcon = (role) => {
    return role === 'Super Admin' ? ShieldCheck : Shield;
  };

  // --- TAB CONFIG ---
  const TABS = [
    { key: 'all', label: 'All Users', count: admins.length },
    { key: 'admins', label: 'Admins', count: admins.filter(a => a.role === 'Admin').length },
    { key: 'super', label: 'Super Admins', count: admins.filter(a => a.role === 'Super Admin').length },
  ];

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and manage administrator accounts and permissions.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Admin
        </button>
      </div>

      {/* --- TABS --- */}
      <div className="bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm inline-flex flex-wrap gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Card Header + Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Administrators</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredAdmins.length} {filteredAdmins.length === 1 ? 'account' : 'accounts'} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Role Filter */}
            <div className="relative sm:w-44">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredAdmins.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmins.map((admin) => {
                  const RoleIcon = getRoleIcon(admin.role);
                  return (
                    <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Admin Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                            admin.role === 'Super Admin' 
                              ? 'bg-blue-50 border-blue-100' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <span className={`text-xs font-bold ${
                              admin.role === 'Super Admin' ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {admin.name.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{admin.name}</p>
                            <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(admin.role)}`}>
                          <RoleIcon className="w-3 h-3" />
                          {admin.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(admin.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            admin.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}></span>
                          {admin.status}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-sm text-gray-600">{admin.createdAt}</td>

                      {/* Last Login */}
                      <td className="px-6 py-4 text-sm text-gray-500">{admin.lastLogin}</td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(admin)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(admin)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Empty State */
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No admins found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                No administrator accounts match your search or filters. Try adjusting them.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredAdmins.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {filteredAdmins.length} of {admins.length} admins
            </span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-md cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md">
                1
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {formModal.open && (
        <AdminFormModal
          mode={formModal.mode}
          initialData={formModal.data || { name: '', email: '', role: 'Admin', password: '' }}
          onClose={handleCloseForm}
          onSave={handleSaveAdmin}
        />
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {confirmModal.open && confirmModal.admin && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg border border-red-100 shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Delete Admin</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{confirmModal.admin.name}</span>? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCloseDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// =========================================================
// ADMIN FORM MODAL COMPONENT
// =========================================================
const AdminFormModal = ({ mode, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ...initialData,
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (mode === 'create' && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onSave(formData);
  };

  const isSuperAdmin = formData.role === 'Super Admin';

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              isSuperAdmin ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200'
            }`}>
              {isSuperAdmin ? (
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              ) : (
                <Shield className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {mode === 'create' ? 'Create Admin' : 'Edit Admin'}
              </h3>
              <p className="text-xs text-gray-500">
                {mode === 'create' ? 'Add a new administrator to your school.' : 'Update administrator details.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Joseph philip"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. joseph philip.doe@school.edu"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              required
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('role', 'Admin')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                  formData.role === 'Admin'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleChange('role', 'Super Admin')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                  formData.role === 'Super Admin'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Super Admin
              </button>
            </div>
          </div>

          {/* Password Fields (Only for create) */}
          {mode === 'create' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors self-start"
              >
                {showPassword ? 'Hide passwords' : 'Show passwords'}
              </button>
            </>
          )}

          {/* Permission Notice */}
          <div className={`flex items-start gap-2 p-3 rounded-lg border ${
            isSuperAdmin 
              ? 'bg-blue-50/50 border-blue-100' 
              : 'bg-gray-50 border-gray-100'
          }`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
              isSuperAdmin ? 'text-blue-600' : 'text-gray-500'
            }`} />
            <p className={`text-xs ${
              isSuperAdmin ? 'text-blue-700' : 'text-gray-600'
            }`}>
              {isSuperAdmin 
                ? 'Super Admins have full access to all settings, including the Danger Zone.'
                : 'Admins have limited access. They cannot delete the school or manage other admins.'
              }
            </p>
          </div>

        </form>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {mode === 'create' ? 'Create Admin' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Admin