/**
 * ContentService Usage Examples
 * 
 * This file demonstrates how to use the ContentService class
 * for content management operations.
 */

import { ContentService } from './ContentService';
import type { Service, BlogPost, Testimonial } from '@/types/admin-content';

// ============================================================================
// Example 1: Fetch all services
// ============================================================================

async function fetchAllServices() {
  const response = await ContentService.getAll<Service>('services');
  
  if (response.success && response.data) {
    console.log('Services:', response.data);
    return response.data;
  } else {
    console.error('Error fetching services:', response.error);
    return [];
  }
}

// ============================================================================
// Example 2: Fetch services with filters
// ============================================================================

async function fetchPublishedServices() {
  const response = await ContentService.getAll<Service>('services', {
    published: true,
    limit: 10,
    offset: 0,
  });
  
  if (response.success && response.data) {
    console.log('Published services:', response.data);
    return response.data;
  } else {
    console.error('Error:', response.error);
    return [];
  }
}

// ============================================================================
// Example 3: Search for content
// ============================================================================

async function searchBlogPosts(searchTerm: string) {
  const response = await ContentService.getAll<BlogPost>('blogs', {
    search: searchTerm,
  });
  
  if (response.success && response.data) {
    console.log('Search results:', response.data);
    return response.data;
  } else {
    console.error('Error:', response.error);
    return [];
  }
}

// ============================================================================
// Example 4: Get a single item by ID
// ============================================================================

async function getServiceById(id: string) {
  const response = await ContentService.getById<Service>('services', id);
  
  if (response.success && response.data) {
    console.log('Service:', response.data);
    return response.data;
  } else {
    console.error('Error:', response.error);
    return null;
  }
}

// ============================================================================
// Example 5: Create new content
// ============================================================================

async function createNewService() {
  const newService = {
    title: 'Primary Care',
    description: 'Comprehensive primary care services for all ages',
    icon: 'stethoscope',
    features: [
      'Annual checkups',
      'Preventive care',
      'Chronic disease management',
    ],
    color_scheme: 'blue',
    published: false,
    sort_order: 0,
  };
  
  const response = await ContentService.create<Service>('services', newService);
  
  if (response.success && response.data) {
    console.log('Created service:', response.data);
    return response.data;
  } else {
    console.error('Error creating service:', response.error);
    return null;
  }
}

// ============================================================================
// Example 6: Update existing content
// ============================================================================

async function updateService(id: string) {
  const updates = {
    title: 'Updated Service Title',
    published: true,
  };
  
  const response = await ContentService.update<Service>('services', id, updates);
  
  if (response.success && response.data) {
    console.log('Updated service:', response.data);
    return response.data;
  } else {
    console.error('Error updating service:', response.error);
    return null;
  }
}

// ============================================================================
// Example 7: Delete content
// ============================================================================

async function deleteService(id: string) {
  const response = await ContentService.delete('services', id);
  
  if (response.success) {
    console.log('Service deleted successfully');
    return true;
  } else {
    console.error('Error deleting service:', response.error);
    return false;
  }
}

// ============================================================================
// Example 8: Bulk publish multiple items
// ============================================================================

async function bulkPublishServices(ids: string[]) {
  const response = await ContentService.bulkUpdate<Service>(
    'services',
    ids,
    { published: true }
  );
  
  if (response.success && response.data !== null) {
    console.log(`Published ${response.data} services`);
    return response.data;
  } else {
    console.error('Error bulk publishing:', response.error);
    return 0;
  }
}

// ============================================================================
// Example 9: Bulk delete multiple items
// ============================================================================

async function bulkDeleteTestimonials(ids: string[]) {
  const response = await ContentService.bulkDelete('testimonials', ids);
  
  if (response.success && response.data !== null) {
    console.log(`Deleted ${response.data} testimonials`);
    return response.data;
  } else {
    console.error('Error bulk deleting:', response.error);
    return 0;
  }
}

// ============================================================================
// Example 10: Reorder content items
// ============================================================================

async function reorderServices(serviceIds: string[]) {
  // Create items array with new sort order
  const items = serviceIds.map((id, index) => ({
    id,
    sort_order: index,
  }));
  
  const response = await ContentService.updateOrder('services', items);
  
  if (response.success) {
    console.log('Services reordered successfully');
    return true;
  } else {
    console.error('Error reordering services:', response.error);
    return false;
  }
}

// ============================================================================
// Example 11: Filter by category
// ============================================================================

async function fetchBlogsByCategory(category: string) {
  const response = await ContentService.getAll<BlogPost>('blogs', {
    category,
    published: true,
  });
  
  if (response.success && response.data) {
    console.log(`Blogs in category "${category}":`, response.data);
    return response.data;
  } else {
    console.error('Error:', response.error);
    return [];
  }
}

// ============================================================================
// Example 12: Error handling with retry
// ============================================================================

async function fetchWithErrorHandling() {
  const response = await ContentService.getAll<Service>('services');
  
  if (response.success && response.data) {
    // Success case
    return response.data;
  } else if (response.error) {
    // Error case - the service automatically retries network errors
    if (response.error.code === 'AUTH_ERROR') {
      console.error('Authentication error - redirect to login');
      // Handle auth error (e.g., redirect to login)
    } else if (response.error.code === 'NETWORK_ERROR') {
      console.error('Network error - already retried automatically');
      // Show user-friendly error message
    } else {
      console.error('Other error:', response.error.message);
      // Handle other errors
    }
    return [];
  }
  
  return [];
}

// ============================================================================
// Example 13: Pagination
// ============================================================================

async function fetchServicesPage(page: number, pageSize: number = 10) {
  const offset = page * pageSize;
  
  const response = await ContentService.getAll<Service>('services', {
    limit: pageSize,
    offset,
  });
  
  if (response.success && response.data) {
    console.log(`Page ${page + 1}:`, response.data);
    return response.data;
  } else {
    console.error('Error:', response.error);
    return [];
  }
}

// ============================================================================
// Export examples for use in other files
// ============================================================================

export const examples = {
  fetchAllServices,
  fetchPublishedServices,
  searchBlogPosts,
  getServiceById,
  createNewService,
  updateService,
  deleteService,
  bulkPublishServices,
  bulkDeleteTestimonials,
  reorderServices,
  fetchBlogsByCategory,
  fetchWithErrorHandling,
  fetchServicesPage,
};
