import React, { useState } from 'react';
import { MenuItem, SizeOption, AddOn, Order, OrderStatus, RestaurantInfo } from '../types';
import { 
  Plus, Trash2, Save, Clock, Flame, Leaf, Wheat, 
  LayoutGrid, ClipboardList, Settings, XCircle, 
  ChefHat, AlertCircle, DollarSign, Image as ImageIcon, Tags
} from 'lucide-react';

interface AdminPanelProps {
  onAddItem: (item: MenuItem) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  restaurantInfo: RestaurantInfo;
  onUpdateRestaurant: (info: RestaurantInfo) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onClose: () => void;
}

type Tab = 'menu' | 'orders' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onAddItem, 
  orders, 
  onUpdateOrderStatus, 
  restaurantInfo, 
  onUpdateRestaurant,
  categories,
  onAddCategory,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Form State for New Item
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    basePrice: 0,
    category: categories[0] || 'Mains',
    image: '',
    calories: 0,
    preparationTime: '',
    isBestseller: false,
    isChefsChoice: false,
    isSpicy: false,
    isVegetarian: false,
    isGlutenFree: false,
    sizes: [{ id: 's1', label: 'Regular', priceModifier: 0 }],
    addOns: [],
    pairingNote: ''
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.basePrice) return;

    const item: MenuItem = {
      ...newItem as MenuItem,
      id: Math.random().toString(36).substr(2, 9),
      image: newItem.image || 'https://picsum.photos/seed/default/600/400', // Fallback
    };

    onAddItem(item);
    // Reset form
    setNewItem({
        name: '',
        description: '',
        basePrice: 0,
        category: categories[0] || 'Mains',
        image: '',
        calories: 0,
        preparationTime: '',
        isBestseller: false,
        isChefsChoice: false,
        isSpicy: false,
        isVegetarian: false,
        isGlutenFree: false,
        sizes: [{ id: 's1', label: 'Regular', priceModifier: 0 }],
        addOns: [],
        pairingNote: ''
    });
    alert('Item added successfully!');
  };

  const updateNewItem = (field: keyof MenuItem, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  // --- Dynamic Field Handlers ---
  const addSize = () => {
    const newSize: SizeOption = { id: Math.random().toString(36).substr(2, 5), label: '', priceModifier: 0 };
    setNewItem(prev => ({ ...prev, sizes: [...(prev.sizes || []), newSize] }));
  };

  const updateSize = (id: string, field: keyof SizeOption, value: any) => {
    setNewItem(prev => ({
      ...prev,
      sizes: prev.sizes?.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeSize = (id: string) => {
    setNewItem(prev => ({ ...prev, sizes: prev.sizes?.filter(s => s.id !== id) }));
  };

  const addAddOn = () => {
    const newAddOn: AddOn = { id: Math.random().toString(36).substr(2, 5), name: '', price: 0 };
    setNewItem(prev => ({ ...prev, addOns: [...(prev.addOns || []), newAddOn] }));
  };

  const updateAddOn = (id: string, field: keyof AddOn, value: any) => {
    setNewItem(prev => ({
      ...prev,
      addOns: prev.addOns?.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const removeAddOn = (id: string) => {
    setNewItem(prev => ({ ...prev, addOns: prev.addOns?.filter(a => a.id !== id) }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col md:flex-row animate-in slide-in-from-bottom duration-300">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-900 text-white flex flex-col justify-between shrink-0">
        <div>
            <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                <div className="bg-amber-500 p-2 rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-lg leading-tight">Admin Panel</h2>
                    <p className="text-xs text-gray-400">Manage Restaurant</p>
                </div>
            </div>
            
            <nav className="p-4 space-y-2">
                <button 
                    onClick={() => setActiveTab('menu')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'menu' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <LayoutGrid className="w-5 h-5" />
                    <span className="font-medium">Add Item</span>
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <ClipboardList className="w-5 h-5" />
                    <div className="flex-1 flex justify-between items-center">
                        <span className="font-medium">Orders</span>
                        {orders.filter(o => o.status === 'Pending').length > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {orders.filter(o => o.status === 'Pending').length}
                            </span>
                        )}
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
            </nav>
        </div>
        
        <div className="p-4 border-t border-gray-800">
            <button onClick={onClose} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors">
                <XCircle className="w-4 h-4" />
                <span>Exit Admin</span>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
        
        {/* === MENU MANAGEMENT TAB === */}
        {activeTab === 'menu' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Add New Menu Item</h2>
            <form onSubmit={handleAddItem} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
                
                {/* Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                            <input 
                                required
                                type="text" 
                                value={newItem.name}
                                onChange={e => updateNewItem('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                placeholder="e.g. Lobster Thermidor"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select 
                                value={newItem.category}
                                onChange={e => updateNewItem('category', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea 
                                required
                                value={newItem.description}
                                onChange={e => updateNewItem('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                placeholder="Describe the dish in detail..."
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Base Price ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={newItem.basePrice || ''}
                                    onChange={e => updateNewItem('basePrice', parseFloat(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="url"
                                    value={newItem.image}
                                    onChange={e => updateNewItem('image', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attributes */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Details & Attributes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time</label>
                             <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text"
                                    value={newItem.preparationTime}
                                    onChange={e => updateNewItem('preparationTime', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                    placeholder="e.g. 15-20 min"
                                />
                             </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                             <div className="relative">
                                <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="number"
                                    value={newItem.calories || ''}
                                    onChange={e => updateNewItem('calories', parseFloat(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                    placeholder="e.g. 650"
                                />
                             </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <input type="checkbox" checked={newItem.isVegetarian} onChange={e => updateNewItem('isVegetarian', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                            <Leaf className="w-4 h-4 text-green-600" /> <span className="text-sm font-medium">Vegetarian</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <input type="checkbox" checked={newItem.isGlutenFree} onChange={e => updateNewItem('isGlutenFree', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                            <Wheat className="w-4 h-4 text-amber-600" /> <span className="text-sm font-medium">Gluten Free</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <input type="checkbox" checked={newItem.isSpicy} onChange={e => updateNewItem('isSpicy', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                            <Flame className="w-4 h-4 text-red-600" /> <span className="text-sm font-medium">Spicy</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <input type="checkbox" checked={newItem.isChefsChoice} onChange={e => updateNewItem('isChefsChoice', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                            <ChefHat className="w-4 h-4 text-gray-800" /> <span className="text-sm font-medium">Chef's Choice</span>
                        </label>
                         <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <input type="checkbox" checked={newItem.isBestseller} onChange={e => updateNewItem('isBestseller', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                            <AlertCircle className="w-4 h-4 text-orange-500" /> <span className="text-sm font-medium">Bestseller</span>
                        </label>
                    </div>
                </div>

                {/* Configuration: Sizes & Addons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sizes */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sizes</h3>
                             <button type="button" onClick={addSize} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add Size</button>
                        </div>
                        <div className="space-y-3">
                            {newItem.sizes?.map((size, idx) => (
                                <div key={size.id} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Label (e.g. Large)" 
                                        value={size.label}
                                        onChange={e => updateSize(size.id, 'label', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500"
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Price +$" 
                                        value={size.priceModifier}
                                        onChange={e => updateSize(size.id, 'priceModifier', parseFloat(e.target.value))}
                                        className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500"
                                    />
                                    {newItem.sizes && newItem.sizes.length > 1 && (
                                        <button type="button" onClick={() => removeSize(size.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div className="space-y-4">
                         <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Add-Ons</h3>
                             <button type="button" onClick={addAddOn} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add Option</button>
                        </div>
                        <div className="space-y-3">
                            {newItem.addOns?.map((addon, idx) => (
                                <div key={addon.id} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Name (e.g. Extra Cheese)" 
                                        value={addon.name}
                                        onChange={e => updateAddOn(addon.id, 'name', e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500"
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Price $" 
                                        value={addon.price}
                                        onChange={e => updateAddOn(addon.id, 'price', parseFloat(e.target.value))}
                                        className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500"
                                    />
                                     <button type="button" onClick={() => removeAddOn(addon.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            ))}
                            {(!newItem.addOns || newItem.addOns.length === 0) && (
                                <p className="text-sm text-gray-400 italic">No add-ons configured.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Context */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Sommelier AI Context</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pairing Note</label>
                    <textarea 
                        value={newItem.pairingNote}
                        onChange={e => updateNewItem('pairingNote', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="e.g. Pairs well with a light Pinot Noir..."
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save Item
                    </button>
                </div>

            </form>
          </div>
        )}

        {/* === ORDERS TAB === */}
        {activeTab === 'orders' && (
             <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Incoming Orders</h2>
                
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200">
                        <ClipboardList className="w-16 h-16 text-gray-200 mb-4" />
                        <p className="text-gray-500">No active orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.slice().reverse().map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-2">
                                    <div className="flex gap-4 items-center">
                                        <span className="font-mono text-sm font-bold text-gray-500">#{order.id}</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                                            order.status === 'Pending' ? 'bg-red-100 text-red-700' :
                                            order.status === 'Preparing' ? 'bg-amber-100 text-amber-700' :
                                            order.status === 'Ready' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(order.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-bold text-gray-900">{order.customerName}</p>
                                                <p className="text-sm text-gray-500">Table: {order.tableNumber}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-xl text-gray-900">${order.totalPrice.toFixed(2)}</p>
                                                <p className="text-xs text-gray-500">{order.items.length} items</p>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100 pt-3 space-y-2">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-gray-800">
                                                        <span className="font-bold text-gray-900">{item.quantity}x</span> {item.name} <span className="text-gray-400">({item.selectedSize.label})</span>
                                                    </span>
                                                    <span className="text-gray-600">${item.totalPrice.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                        <button 
                                            onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                                            disabled={order.status !== 'Pending'}
                                            className="flex-1 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Start Prep
                                        </button>
                                        <button 
                                            onClick={() => onUpdateOrderStatus(order.id, 'Ready')}
                                            disabled={order.status !== 'Preparing'}
                                            className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Mark Ready
                                        </button>
                                        <button 
                                            onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                                            disabled={order.status !== 'Ready'}
                                            className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Delivered
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        )}

        {/* === SETTINGS TAB === */}
        {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 font-serif">Restaurant Settings</h2>
                
                {/* General Info */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber-500" />
                        General Information
                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                        <input 
                            type="text" 
                            value={restaurantInfo.name}
                            onChange={(e) => onUpdateRestaurant({...restaurantInfo, name: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={restaurantInfo.logo || ''}
                                onChange={(e) => onUpdateRestaurant({...restaurantInfo, logo: e.target.value})}
                                placeholder="https://..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            {restaurantInfo.logo && (
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                    <img src={restaurantInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories Management */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Tags className="w-5 h-5 text-amber-500" />
                        Menu Categories
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <span key={cat} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                {cat}
                            </span>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add New Category</label>
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                value={newCategoryInput}
                                onChange={(e) => setNewCategoryInput(e.target.value)}
                                placeholder="e.g. Specials"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            <button 
                                onClick={() => {
                                    if(newCategoryInput.trim()) {
                                        onAddCategory(newCategoryInput.trim());
                                        setNewCategoryInput('');
                                    }
                                }}
                                disabled={!newCategoryInput.trim()}
                                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};