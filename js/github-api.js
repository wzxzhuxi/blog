/**
 * ProArt Blog - GitHub API Module
 *
 * Handles fetching repository data from GitHub API with caching.
 * Uses sessionStorage to cache results and reduce API calls.
 */

(function() {
  'use strict';

  var CACHE_KEY = 'github_repo_cache';

  // ============================================
  // Cache Management (Daily refresh at midnight)
  // ============================================

  /**
   * Get today's date string (YYYY-MM-DD)
   * @returns {string} Date string
   */
  function getTodayDateString() {
    var now = new Date();
    return now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
  }

  /**
   * Get cached repository data (valid for current day only)
   * @returns {object} Cached repos or empty object
   */
  function getCache() {
    try {
      var cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return {};

      var data = JSON.parse(cached);
      // Cache expires at midnight - check if still same day
      if (data.date !== getTodayDateString()) {
        localStorage.removeItem(CACHE_KEY);
        return {};
      }
      return data.repos || {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Save repository data to cache (valid until midnight)
   * @param {object} repos - Repository data to cache
   */
  function setCache(repos) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        date: getTodayDateString(),
        repos: repos
      }));
    } catch (e) {
      // Storage full or unavailable - fail silently
    }
  }

  /**
   * Clear all cached data
   */
  function clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {
      // Fail silently
    }
  }

  // ============================================
  // API Functions
  // ============================================

  /**
   * Fetch single repository data from GitHub API
   * @param {string} username - GitHub username
   * @param {string} repoName - Repository name
   * @param {function} callback - Callback(error, data)
   */
  function fetchRepoData(username, repoName, callback) {
    if (!username || !repoName) {
      callback(new Error('Invalid username or repo name'), null);
      return;
    }

    var cache = getCache();
    var cacheKey = username + '/' + repoName;

    // Return cached data if available
    if (cache[cacheKey]) {
      callback(null, cache[cacheKey]);
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/repos/' + username + '/' + repoName, true);
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200) {
        try {
          var response = JSON.parse(xhr.responseText);
          var repoData = {
            stars: response.stargazers_count || 0,
            forks: response.forks_count || 0,
            description: response.description || '',
            language: response.language || '',
            updated_at: response.updated_at || ''
          };

          // Update cache
          cache[cacheKey] = repoData;
          setCache(cache);

          callback(null, repoData);
        } catch (e) {
          callback(new Error('Failed to parse API response'), null);
        }
      } else if (xhr.status === 403) {
        // Rate limited
        callback(new Error('GitHub API rate limit exceeded'), null);
      } else if (xhr.status === 404) {
        callback(new Error('Repository not found'), null);
      } else {
        callback(new Error('API request failed: ' + xhr.status), null);
      }
    };

    xhr.onerror = function() {
      callback(new Error('Network error'), null);
    };

    xhr.send();
  }

  /**
   * Batch fetch multiple repositories
   * @param {string} username - GitHub username
   * @param {Array} repoNames - Array of repository names
   * @param {function} callback - Callback(error, results)
   */
  function fetchMultipleRepos(username, repoNames, callback) {
    if (!repoNames || repoNames.length === 0) {
      callback(null, {});
      return;
    }

    var results = {};
    var errors = [];
    var pending = repoNames.length;

    repoNames.forEach(function(repoName) {
      fetchRepoData(username, repoName, function(err, data) {
        if (err) {
          errors.push({ repo: repoName, error: err.message });
        } else if (data) {
          results[repoName] = data;
        }

        pending--;
        if (pending === 0) {
          // All requests complete
          if (errors.length > 0 && Object.keys(results).length === 0) {
            callback(new Error('All API requests failed'), null);
          } else {
            callback(null, results);
          }
        }
      });
    });
  }

  /**
   * Update star counts for project elements in DOM
   * @param {string} username - GitHub username
   * @param {Array} projects - Array of project objects with repo property
   */
  function updateProjectStars(username, projects) {
    if (!projects || projects.length === 0) return;

    var repoNames = projects
      .filter(function(p) { return p.repo; })
      .map(function(p) { return p.repo; });

    fetchMultipleRepos(username, repoNames, function(err, results) {
      // Handle each repo's star element
      repoNames.forEach(function(repoName) {
        var starEl = document.querySelector('[data-repo="' + repoName + '"] .project-card__stars');
        if (!starEl) return;

        var data = results ? results[repoName] : null;

        if (data && data.stars !== undefined && data.stars > 0) {
          // Success: show star count
          starEl.textContent = '[*] ' + data.stars;
          starEl.style.display = '';
        } else {
          // Failed or no stars: hide the element
          starEl.style.display = 'none';
        }
      });
    });
  }

  // ============================================
  // Export
  // ============================================

  window.GitHubAPI = {
    fetchRepoData: fetchRepoData,
    fetchMultipleRepos: fetchMultipleRepos,
    updateProjectStars: updateProjectStars,
    clearCache: clearCache
  };

})();
