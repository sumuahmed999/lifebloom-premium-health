/**
 * API Client Usage Examples
 * 
 * This file demonstrates how to use the API client utility
 * for common content management operations.
 */

import { apiClient } from './apiClient';
import type { Service, BlogPost, Testimonial } from '@/types/admin-content';

// ============================================================================
// Authentication Examples
// ============================================================================

/**
 * Example: Sign in and check authentication state
 */
export async function authenticationExample() {
  // Sign in
  const signInResult = await apiClient.signIn('admin@example.com', 'password123');
  
  if (signInResult.success) {
    console.log('✓ Signed in as:', signInResult.data.user.email);
  } else {
    console.error('✗ Sign in failed:', signInResult.error.message);
    return;
  }

  // Check current auth state
  const authState = await apiClient.getAuthState();
  console.log('Authenticated:', authState.isAuthenticated);
  console.log('User:', authState.user?.email);

  // Sign out
  const signOutResult = await apiClient.signOut();
  if (signOutResult.success) {
    console.log('✓ Signed out successfully');
  }
}

/**
 * Example: Listen to authentication state changes
 */
export function authStateListenerExample() {
  const subscription = apiClient.onAuthStateChange((state) => {
    if (state.isAuthenticated) {
      console.log('User signed in:', state.user.email);
      // Update UI, redirect to dashboard, etc.
    } else {
      console.log('User signed out');
      // Redirect to login page
    }
  });

  // Remember to unsubscribe when component unmounts
  return () => subscription.unsubscribe();
}

// ============================================================================
// CRUD Examples
// ============================================================================

/**
 * Example: Create a new service
 */
export async function createServiceExample() {
  const newService = {
    title: 'Primary Care',
    description: 'Comprehensive primary care services for all ages',
    icon: 'stethoscope',
    features: [
      'Annual physical exams',
      'Preventive care',
      'Chronic disease management',
      'Health screenings',
    ],
    color_scheme: '#3b82f6',
    published: false,
    sort_order: 0,
  };

  const result = await apiClient.create<Service>('services', newService);

  if (result.success) {
    console.log('✓ Service created:', result.data.id);
    console.log('  Title:', result.data.title);
    console.log('  Created by:', result.data.created_by);
    return result.data;
  } else {
    console.error('✗ Failed to create service:', result.error.message);
    return null;
  }
}

/**
 * Example: Fetch all published services
 */
export async function fetchPublishedServicesExample() {
  const result = await apiClient.fetchAll<Service>('services', {
    filters: { published: true },
    orderBy: { column: 'sort_order', ascending: true },
  });

  if (result.success) {
    console.log(`✓ Found ${result.data.length} published services`);
    result.data.forEach((service) => {
      console.log(`  - ${service.title}`);
    });
    return result.data;
  } else {
    console.error('✗ Failed to fetch services:', result.error.message);
    return [];
  }
}

/**
 * Example: Update a service
 */
export async function updateServiceExample(serviceId: string) {
  const updates = {
    title: 'Primary Care Services',
    published: true,
  };

  const result = await apiClient.update<Service>('services', serviceId, updates);

  if (result.success) {
    console.log('✓ Service updated:', result.data.id);
    console.log('  New title:', result.data.title);
    console.log('  Published:', result.data.published);
    console.log('  Updated by:', result.data.updated_by);
    return result.data;
  } else {
    console.error('✗ Failed to update service:', result.error.message);
    return null;
  }
}

/**
 * Example: Delete a service
 */
export async function deleteServiceExample(serviceId: string) {
  const result = await apiClient.delete('services', serviceId);

  if (result.success) {
    console.log('✓ Service deleted:', serviceId);
    return true;
  } else {
    console.error('✗ Failed to delete service:', result.error.message);
    return false;
  }
}

// ============================================================================
// Search and Filter Examples
// ============================================================================

/**
 * Example: Search blog posts
 */
export async function searchBlogPostsExample(searchTerm: string) {
  const result = await apiClient.search<BlogPost>(
    'blog_posts',
    searchTerm,
    ['title', 'excerpt', 'content', 'author']
  );

  if (result.success) {
    console.log(`✓ Found ${result.data.length} blog posts matching "${searchTerm}"`);
    result.data.forEach((post) => {
      console.log(`  - ${post.title} by ${post.author}`);
    });
    return result.data;
  } else {
    console.error('✗ Search failed:', result.error.message);
    return [];
  }
}

/**
 * Example: Fetch blog posts with pagination
 */
export async function fetchBlogPostsWithPaginationExample(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;

  const result = await apiClient.fetchAll<BlogPost>('blog_posts', {
    filters: { published: true },
    orderBy: { column: 'created_at', ascending: false },
    limit: pageSize,
    offset: offset,
  });

  if (result.success) {
    console.log(`✓ Page ${page}: ${result.data.length} blog posts`);
    return result.data;
  } else {
    console.error('✗ Failed to fetch blog posts:', result.error.message);
    return [];
  }
}

/**
 * Example: Fetch blog posts by category
 */
export async function fetchBlogPostsByCategoryExample(category: string) {
  const result = await apiClient.fetchAll<BlogPost>('blog_posts', {
    filters: { published: true, category },
    orderBy: { column: 'created_at', ascending: false },
  });

  if (result.success) {
    console.log(`✓ Found ${result.data.length} posts in category "${category}"`);
    return result.data;
  } else {
    console.error('✗ Failed to fetch posts:', result.error.message);
    return [];
  }
}

// ============================================================================
// Bulk Operations Examples
// ============================================================================

/**
 * Example: Bulk publish testimonials
 */
export async function bulkPublishTestimonialsExample(testimonialIds: string[]) {
  const result = await apiClient.bulkUpdate<Testimonial>(
    'testimonials',
    testimonialIds,
    { published: true }
  );

  if (result.success) {
    console.log(`✓ Published ${result.data} testimonials`);
    return result.data;
  } else {
    console.error('✗ Bulk publish failed:', result.error.message);
    return 0;
  }
}

/**
 * Example: Bulk delete services
 */
export async function bulkDeleteServicesExample(serviceIds: string[]) {
  const result = await apiClient.bulkDelete('services', serviceIds);

  if (result.success) {
    console.log(`✓ Deleted ${result.data} services`);
    return result.data;
  } else {
    console.error('✗ Bulk delete failed:', result.error.message);
    return 0;
  }
}

// ============================================================================
// Error Handling Examples
// ============================================================================

/**
 * Example: Comprehensive error handling
 */
export async function errorHandlingExample(serviceId: string) {
  const result = await apiClient.fetchById<Service>('services', serviceId);

  if (result.success) {
    console.log('✓ Service found:', result.data.title);
    return result.data;
  }

  // Handle different error types
  if (apiClient.isAuthError(result.error)) {
    console.error('✗ Authentication required - redirecting to login');
    // Redirect to login page
    return null;
  }

  if (apiClient.isNetworkError(result.error)) {
    console.error('✗ Network error - showing retry option');
    // Show retry button to user
    return null;
  }

  // Generic error
  console.error('✗ Error:', result.error.message);
  if (result.error.code) {
    console.error('  Code:', result.error.code);
  }
  return null;
}

// ============================================================================
// React Hook Example
// ============================================================================

/**
 * Example: Custom React hook using API client
 */
export function useServicesExample() {
  // This would be a real React hook in your application
  // Shown here as a function for demonstration purposes
  
  async function loadServices() {
    const result = await apiClient.fetchAll<Service>('services', {
      filters: { published: true },
      orderBy: { column: 'sort_order', ascending: true },
    });

    if (result.success) {
      return {
        services: result.data,
        loading: false,
        error: null,
      };
    } else {
      return {
        services: [],
        loading: false,
        error: result.error.message,
      };
    }
  }

  return loadServices;
}

// ============================================================================
// Complete Workflow Example
// ============================================================================

/**
 * Example: Complete content management workflow
 */
export async function completeWorkflowExample() {
  console.log('=== Content Management Workflow ===\n');

  // 1. Sign in
  console.log('1. Signing in...');
  const signInResult = await apiClient.signIn('admin@example.com', 'password123');
  if (!signInResult.success) {
    console.error('Failed to sign in');
    return;
  }
  console.log('✓ Signed in\n');

  // 2. Create a new service
  console.log('2. Creating new service...');
  const createResult = await apiClient.create<Service>('services', {
    title: 'Cardiology',
    description: 'Expert heart care services',
    icon: 'heart',
    features: ['ECG', 'Stress tests', 'Heart monitoring'],
    color_scheme: '#ef4444',
    published: false,
    sort_order: 0,
  });
  if (!createResult.success) {
    console.error('Failed to create service');
    return;
  }
  const serviceId = createResult.data.id;
  console.log(`✓ Created service: ${serviceId}\n`);

  // 3. Fetch the service
  console.log('3. Fetching service...');
  const fetchResult = await apiClient.fetchById<Service>('services', serviceId);
  if (!fetchResult.success) {
    console.error('Failed to fetch service');
    return;
  }
  console.log(`✓ Fetched: ${fetchResult.data.title}\n`);

  // 4. Update the service
  console.log('4. Publishing service...');
  const updateResult = await apiClient.update<Service>('services', serviceId, {
    published: true,
  });
  if (!updateResult.success) {
    console.error('Failed to update service');
    return;
  }
  console.log(`✓ Published: ${updateResult.data.published}\n`);

  // 5. Search for the service
  console.log('5. Searching for "cardiology"...');
  const searchResult = await apiClient.search<Service>(
    'services',
    'cardiology',
    ['title', 'description']
  );
  if (!searchResult.success) {
    console.error('Failed to search');
    return;
  }
  console.log(`✓ Found ${searchResult.data.length} results\n`);

  // 6. Delete the service
  console.log('6. Deleting service...');
  const deleteResult = await apiClient.delete('services', serviceId);
  if (!deleteResult.success) {
    console.error('Failed to delete service');
    return;
  }
  console.log('✓ Deleted\n');

  // 7. Sign out
  console.log('7. Signing out...');
  const signOutResult = await apiClient.signOut();
  if (!signOutResult.success) {
    console.error('Failed to sign out');
    return;
  }
  console.log('✓ Signed out\n');

  console.log('=== Workflow Complete ===');
}
