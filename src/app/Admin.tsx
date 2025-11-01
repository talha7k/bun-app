'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  TreeProvider, 
  TreeView, 
  TreeNode, 
  TreeNodeTrigger, 
  TreeNodeContent, 
  TreeExpander, 
  TreeIcon, 
  TreeLabel 
} from '@/components/kibo-ui/tree'
import Login from '@/components/Login'
import AddMenuItemDialog from '@/components/AddMenuItemDialog'
import CategoryDialog from '@/components/CategoryDialog'
import { LocationsManagement } from '@/components/LocationsManagement'
import { MenuItemCard } from '@/components/MenuItemCard'
import { type MenuItem, type MenuItemWithCategory, type MenuItemImage, type Category } from '../types/menu'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'menu' | 'categories' | 'locations'>('menu')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItemWithCategory | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    let isMounted = true; // Track if component is still mounted
    
    if (token) {
      try {
        const decoded = atob(token)
        const [, , timestamp] = decoded.split(':')
        const tokenAge = Date.now() - parseInt(timestamp || '0')
        if (tokenAge < 2 * 60 * 60 * 1000 && isMounted) {
          setIsAuthenticated(true)
        } else if (isMounted) {
          localStorage.removeItem('adminToken')
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem('adminToken')
        }
      }
    }
    if (isMounted) {
      setLoading(false)
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [])

  // Fetch data
  useEffect(() => {
    if (!isAuthenticated) return
    
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/menu-items').then(res => res.json())
    ]).then(([categoriesData, menuItemsData]) => {
      setCategories(categoriesData)
      setMenuItems(menuItemsData)
      setFilteredItems(menuItemsData)
      setLoading(false)
    }).catch(err => {
      console.error('Error fetching data:', err)
      setLoading(false)
    })
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
  }

  // Filter menu items by category
  const filterByCategory = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    if (categoryId === null) {
      setFilteredItems(menuItems)
    } else {
      setFilteredItems(menuItems.filter(item => item.category_id === categoryId))
    }
  }

  const handleEditItem = (item: MenuItem) => {
    // Find the category for this item
    const category = categories.find(cat => cat.id === item.category_id);
    const itemWithCategory: MenuItemWithCategory = {
      ...item,
      category: category || { id: 0, name: 'Unknown' }
    }
    setEditingItem(itemWithCategory)
    setIsDialogOpen(true)
  }

  const handleDeleteItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`/api/menu-items/${id}`, {
          method: 'DELETE'
        })
        
        const updatedItems = menuItems.filter(item => item.id !== id)
        setMenuItems(updatedItems)
        setFilteredItems(selectedCategory ? updatedItems.filter(item => item.category_id === selectedCategory) : updatedItems)
      } catch (err) {
        console.error('Error deleting menu item:', err)
      }
    }
  }

  // Category management handlers
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find(c => c.id === id)
    if (!category) return

    const itemCount = menuItems.filter(item => item.category_id === id).length
    if (itemCount > 0) {
      alert(`Cannot delete "${category.name}" because it has ${itemCount} menu item(s). Please delete or reassign the menu items first.`)
      return
    }

    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          const updatedCategories = await fetch('/api/categories').then(res => res.json())
          setCategories(updatedCategories)
        } else {
          const error = await response.json()
          alert(error.error || 'Failed to delete category')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Failed to delete category')
      }
    }
  }

  const refreshCategories = async () => {
    const updatedCategories = await fetch('/api/categories').then(res => res.json())
    setCategories(updatedCategories)
  }

  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your restaurant content</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
          >
            Logout
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg shadow p-1">
          <Button
            variant={activeTab === 'menu' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('menu')}
            className="flex-1"
          >
            Menu Items
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('categories')}
            className="flex-1"
          >
            Categories
          </Button>
          <Button
            variant={activeTab === 'locations' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('locations')}
            className="flex-1"
          >
            Locations
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'menu' && (
          <div className="flex flex-col lg:flex-row gap-6 min-h-0">
            {/* Left Sidebar - Menu Structure */}
            <div className="w-full lg:w-1/4 bg-white rounded-lg shadow p-6 overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Menu Structure</h2>
              </div>
              
              {/* All Items Option */}
              <div 
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors mb-2 ${
                  selectedCategory === null ? 'bg-accent/10 text-accent font-medium' : ''
                }`}
                onClick={() => filterByCategory(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center">
                    {selectedCategory === null && (
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    )}
                  </div>
                  <span>All Items ({menuItems.length} total)</span>
                </div>
              </div>
              
              <TreeProvider
                defaultExpandedIds={categories.map(cat => `category-${cat.id}`)}
                showLines
                showIcons
                selectable={false}
              >
                <TreeView>
                  {categories.map(category => (
                    <TreeNode 
                      key={category.id} 
                      nodeId={`category-${category.id}`}
                      level={0}
                    >
                      <TreeNodeTrigger 
                        className={`cursor-pointer hover:bg-gray-100 rounded transition-colors ${
                          selectedCategory === category.id ? 'bg-accent/10' : ''
                        }`}
                        onClick={() => filterByCategory(category.id)}
                      >
                        <TreeExpander hasChildren={true} />
                        <TreeIcon hasChildren={true} />
                        <TreeLabel>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center">
                              {selectedCategory === category.id && (
                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                              )}
                            </div>
                            <span className="text-2xl">{category.icon || '📁'}</span>
                            <span>{category.name}</span>
                          </div>
                        </TreeLabel>
                      </TreeNodeTrigger>
                      <TreeNodeContent>
                        {menuItems
                          .filter(item => item.category_id === category.id)
                          .map(item => (
                            <div 
                              key={item.id}
                              className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
                              onClick={() => handleEditItem(item)}
                            >
                              <div className="w-2 h-2 border border-gray-300"></div>
                              <span className="text-sm text-gray-700">{item.name} - {item.price}</span>
                            </div>
                          ))}
                      </TreeNodeContent>
                    </TreeNode>
                  ))}
                </TreeView>
              </TreeProvider>
            </div>

            {/* Right Side - Menu Items List */}
            <div className="flex-1 bg-white rounded-lg shadow p-6 flex flex-col min-h-0 w-full lg:w-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Current Menu Items 
                  {selectedCategory && (
                    <span className="text-sm text-gray-500 ml-2">
                      - {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-white"
                    onClick={() => {
                      setEditingItem(null)
                      setIsDialogOpen(true)
                    }}
                  >
                    Add New Item
                  </Button>
                  {selectedCategory && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => filterByCategory(null)}
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              </div>
              
              {filteredItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">No items found</p>
                    <p className="text-sm">
                      {selectedCategory 
                        ? `No items in ${categories.find(c => c.id === selectedCategory)?.name} category`
                        : 'No menu items available'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                    {filteredItems.map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        variant="admin"
                        tagComponent={(tag: string, index: number) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="bg-accent/10 text-accent hover:bg-accent/20"
                          >
                            {tag}
                          </Badge>
                        )}
                        popularBadge={
                          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                            ⭐ Popular
                          </span>
                        }
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Categories</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const itemCount = menuItems.filter(item => item.category_id === category.id).length
                return (
                  <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{category.icon || '📁'}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">{itemCount} items</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="bg-white rounded-lg shadow p-6">
            <LocationsManagement />
          </div>
        )}

        {/* Dialogs - Only render on relevant tabs */}
        {activeTab === 'menu' && (
          <AddMenuItemDialog 
            categories={categories}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            item={editingItem}
            trigger={<Button className="fixed bottom-4 right-4">Add New Menu Item</Button>}
            onItemSaved={() => {
              fetch('/api/menu-items').then(res => res.json()).then(setMenuItems)
              setEditingItem(null)
            }}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryDialog 
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
            category={editingCategory}
            trigger={<Button className="fixed bottom-4 right-4">Add New Category</Button>}
            onCategorySaved={() => {
              refreshCategories()
              setEditingCategory(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Admin