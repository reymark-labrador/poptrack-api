# Performance Optimization Guide for Property Search API

## 🚀 Overview

This guide covers the performance optimization strategies implemented for the property search API, including database indexing, query optimization, and monitoring.

## 📊 Database Indexes

### 1. Single Field Indexes

```javascript
// Basic filters with high selectivity
propertySchema.index({ type: 1 }) // Property type filter
propertySchema.index({ price: 1 }) // Price range filter
propertySchema.index({ bedrooms: 1 }) // Bedroom filter
propertySchema.index({ bathrooms: 1 }) // Bathroom filter
propertySchema.index({ createdAt: -1 }) // Sorting by newest
```

### 2. Location Indexes

```javascript
// Location-based search
propertySchema.index({ "location.city": 1 }) // City search
propertySchema.index({ "location.address": 1 }) // Address search
```

### 3. Compound Indexes (Most Important)

```javascript
// Common filter combinations (ordered by selectivity)
propertySchema.index({ type: 1, price: 1 }) // Type + Price
propertySchema.index({ "location.city": 1, price: 1 }) // City + Price
propertySchema.index({ bedrooms: 1, bathrooms: 1, price: 1 }) // Bedrooms + Bathrooms + Price
propertySchema.index({ type: 1, "location.city": 1, price: 1 }) // Type + City + Price
```

### 4. Specialized Indexes

```javascript
// Text search (full-text search)
propertySchema.index(
  {
    title: "text",
    description: "text",
    "location.city": "text",
    "location.address": "text",
  },
  {
    weights: {
      title: 10,
      "location.city": 8,
      "location.address": 6,
      description: 3,
    },
  }
)

// Geospatial search (for future use)
propertySchema.index({ "location.coordinates": "2dsphere" })

// Array search
propertySchema.index({ amenities: 1 })

// Pagination optimization
propertySchema.index({ createdAt: -1, _id: 1 })
```

## 🔍 Query Optimization

### 1. Query Builder Pattern

The `PropertyQueryBuilder` class ensures:

- **Index-friendly queries**: All queries use indexed fields
- **Selectivity order**: Most selective filters applied first
- **Consistent patterns**: Standardized query building

### 2. Filter Order (Most Selective First)

```javascript
// Order of application (most to least selective)
1. Type filter (exact match)
2. Location search (regex on indexed fields)
3. City filter (exact match)
4. Price range (range query on indexed field)
5. Bedrooms/Bathrooms (exact matches)
6. Amenities (array contains)
```

### 3. Performance Monitoring

```javascript
const monitor = createPerformanceMonitor()
// ... query execution
monitor.log("Property search query") // Logs execution time
```

## 📈 Performance Metrics

### Expected Performance

- **Simple queries**: < 10ms
- **Complex filters**: < 50ms
- **Location search**: < 100ms
- **Full-text search**: < 200ms

### Monitoring Thresholds

- **Warning**: > 100ms
- **Critical**: > 500ms
- **Alert**: > 1000ms

## 🛠️ Best Practices

### 1. Index Usage

- ✅ Use compound indexes for common filter combinations
- ✅ Order index fields by selectivity (most selective first)
- ✅ Include sorting fields in compound indexes
- ✅ Use covered queries when possible
- ❌ Avoid creating too many indexes (write performance impact)

### 2. Query Patterns

- ✅ Use exact matches when possible
- ✅ Limit result sets with pagination
- ✅ Use projection to return only needed fields
- ✅ Avoid `$where` queries (they can't use indexes)
- ❌ Avoid complex regex patterns without indexes

### 3. Pagination

- ✅ Use `skip` and `limit` for pagination
- ✅ Include `_id` in compound indexes for efficient pagination
- ✅ Set reasonable limits (max 100 items per page)
- ❌ Avoid deep pagination (skip > 1000)

## 🔧 Query Analysis

### Using MongoDB Explain

```javascript
// Analyze query performance
const explanation = await Property.find(query).explain("executionStats")
console.log("Query plan:", explanation.queryPlanner.winningPlan)
console.log("Execution stats:", explanation.executionStats)
```

### Key Metrics to Monitor

- **nReturned**: Number of documents returned
- **totalKeysExamined**: Number of index keys examined
- **totalDocsExamined**: Number of documents examined
- **executionTimeMillis**: Query execution time

## 🚨 Performance Troubleshooting

### Slow Query Diagnosis

1. **Use `.explain()`** to analyze query plan
2. **Check index usage** - ensure queries use indexes
3. **Monitor execution stats** - look for high document examination
4. **Check compound index order** - most selective fields first

### Common Issues

- **Missing indexes**: Queries scanning entire collection
- **Wrong index order**: Compound indexes not being used efficiently
- **Large result sets**: Not using pagination or limits
- **Complex regex**: Slow pattern matching without indexes

## 📋 Index Maintenance

### Regular Tasks

- **Monitor index usage**: Check which indexes are being used
- **Remove unused indexes**: Drop indexes that aren't being used
- **Rebuild indexes**: Periodically rebuild indexes for optimal performance
- **Update statistics**: Keep MongoDB query planner statistics current

### Index Size Considerations

```javascript
// Check index sizes
db.properties.getIndexes()

// Monitor index usage
db.properties.aggregate([{ $indexStats: {} }])
```

## 🎯 Optimization Checklist

- [ ] All common filter combinations have compound indexes
- [ ] Index fields ordered by selectivity
- [ ] Pagination uses efficient skip/limit with proper indexes
- [ ] Location search uses indexed fields
- [ ] Performance monitoring implemented
- [ ] Query execution time logged
- [ ] Regular performance analysis scheduled
- [ ] Index usage statistics monitored

## 🔮 Future Optimizations

### 1. Caching Strategy

- **Redis caching** for frequent queries
- **Query result caching** with TTL
- **Aggregation caching** for complex filters

### 2. Advanced Search

- **Elasticsearch integration** for full-text search
- **Geospatial optimization** with proper coordinate indexing
- **Fuzzy matching** for location search

### 3. Database Optimization

- **Read replicas** for query distribution
- **Sharding** for horizontal scaling
- **Connection pooling** optimization

---

_This guide should be updated as the application scales and new performance requirements emerge._
