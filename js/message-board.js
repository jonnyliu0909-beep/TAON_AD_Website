/**
 * Message Board JavaScript
 * Handles message submission, loading, and replies
 */

(function() {
    'use strict';
    
    const API_URL = 'api/messages.php';
    const MESSAGES_PER_PAGE = 10;
    const STORAGE_KEY = 'taon_message_board';
    
    // Detect if running from file:// protocol
    const isFileProtocol = window.location.protocol === 'file:' || !window.location.protocol || window.location.href.indexOf('file://') === 0;
    const useLocalStorage = isFileProtocol;
    
    // Debug log
    console.log('Message Board: Protocol =', window.location.protocol, 'Use localStorage =', useLocalStorage);
    
    let currentPage = 1;
    let isLoading = false;
    let isSubmitting = false; // Flag to prevent duplicate submissions
    
    // Initialize message board
    function init() {
        // Show storage mode indicator
        if (useLocalStorage) {
            const indicator = document.getElementById('storage-mode-indicator');
            if (indicator) {
                indicator.textContent = '(Local Storage Mode)';
                indicator.style.display = 'inline';
                indicator.title = 'Using local storage because page is opened via file:// protocol. For full functionality, use a web server.';
            }
        }
        
        loadMessages();
        setupFormSubmit();
        setupRefreshButton();
        setupLanguageChange();
    }
    
    // Load messages from server or localStorage
    function loadMessages(page = 1) {
        if (isLoading) return;
        
        isLoading = true;
        currentPage = page;
        
        const loadingEl = document.getElementById('message-board-loading');
        const listEl = document.getElementById('message-board-list');
        const emptyEl = document.getElementById('message-board-empty');
        
        loadingEl.style.display = 'block';
        listEl.style.display = 'none';
        emptyEl.style.display = 'none';
        
        if (useLocalStorage) {
            // Use localStorage
            setTimeout(function() {
                try {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    const data = stored ? JSON.parse(stored) : { messages: [] };
                    let messages = data.messages || [];
                    
                    console.log('Loaded messages from localStorage:', messages.length);
                    
                    // Remove duplicates based on id
                    const seenIds = new Set();
                    messages = messages.filter(function(msg) {
                        if (!msg.id || seenIds.has(msg.id)) {
                            return false;
                        }
                        seenIds.add(msg.id);
                        return true;
                    });
                    
                    // Save deduplicated messages back to localStorage if duplicates were found
                    if (seenIds.size < data.messages.length) {
                        console.log('Removed duplicate messages');
                        const dataToSave = { messages: messages };
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
                    }
                    
                    // Sort by timestamp (newest first)
                    messages.sort(function(a, b) {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });
                    
                    // Paginate
                    const total = messages.length;
                    const offset = (page - 1) * MESSAGES_PER_PAGE;
                    const paginatedMessages = messages.slice(offset, offset + MESSAGES_PER_PAGE);
                    
                    console.log('Total messages:', total, 'Page:', page, 'Showing:', paginatedMessages.length);
                    
                    isLoading = false;
                    loadingEl.style.display = 'none';
                    
                    if (paginatedMessages.length > 0) {
                        renderMessages(paginatedMessages);
                        listEl.style.display = 'block';
                        emptyEl.style.display = 'none';
                    } else {
                        console.log('No messages to display');
                        listEl.style.display = 'none';
                        emptyEl.style.display = 'block';
                    }
                } catch (e) {
                    isLoading = false;
                    loadingEl.style.display = 'none';
                    console.error('Failed to load messages from localStorage:', e);
                    emptyEl.style.display = 'block';
                }
            }, 300);
        } else {
            // Use PHP API
            $.ajax({
                url: API_URL,
                method: 'GET',
                data: { action: 'get', page: page, per_page: MESSAGES_PER_PAGE },
                dataType: 'json',
                success: function(response) {
                    isLoading = false;
                    loadingEl.style.display = 'none';
                    
                    if (response.success && response.messages && response.messages.length > 0) {
                        renderMessages(response.messages);
                        listEl.style.display = 'block';
                    } else {
                        emptyEl.style.display = 'block';
                    }
                },
                error: function(xhr, status, error) {
                    isLoading = false;
                    loadingEl.style.display = 'none';
                    console.error('Failed to load messages:', error);
                    
                    // Show error message
                    const errorMsg = getTranslation('message_board.loading') || 'Failed to load messages';
                    listEl.innerHTML = '<div class="alert alert-danger">' + errorMsg + '</div>';
                    listEl.style.display = 'block';
                }
            });
        }
    }
    
    // Save messages to localStorage
    function saveToLocalStorage(messages) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages }));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    }
    
    // Load messages from localStorage
    function loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : { messages: [] };
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return { messages: [] };
        }
    }
    
    // Get current user email from form (if filled)
    function getCurrentUserEmail() {
        const emailField = document.getElementById('lm_email');
        return emailField ? emailField.value.trim().toLowerCase() : '';
    }
    
    // Check if user is the owner of a message
    function isMessageOwner(message) {
        const currentEmail = getCurrentUserEmail();
        if (!currentEmail || !message.email) return false;
        return currentEmail.toLowerCase() === message.email.toLowerCase();
    }
    
    // Render messages to the page
    function renderMessages(messages) {
        const listEl = document.getElementById('message-board-list');
        let html = '';
        
        messages.forEach(function(msg) {
            const date = formatDate(msg.timestamp);
            const postedBy = getTranslation('message_board.posted_by') || 'Posted by';
            const on = getTranslation('message_board.on') || 'on';
            const replyText = getTranslation('message_board.reply') || 'Reply';
            const repliesText = getTranslation('message_board.replies') || 'Replies';
            const editText = getTranslation('message_board.edit') || 'Edit';
            const deleteText = getTranslation('message_board.delete') || 'Delete';
            const isOwner = isMessageOwner(msg);
            const isEditing = false; // Track edit state per message
            
            html += '<div class="message-item" data-message-id="' + escapeHtml(msg.id) + '" data-message-email="' + escapeHtml(msg.email || '') + '">';
            html += '<div class="message-header">';
            html += '<div class="message-author">';
            html += '<strong>' + escapeHtml(msg.name) + '</strong>';
            if (msg.email) {
                html += ' <span class="message-email">(' + escapeHtml(msg.email) + ')</span>';
            }
            // Edit/Delete buttons (only for owner)
            if (isOwner) {
                html += '<div class="message-actions">';
                html += '<button class="btn btn-link btn-sm btn-edit-message" data-message-id="' + escapeHtml(msg.id) + '">';
                html += '<i class="fa fa-edit"></i> ' + editText;
                html += '</button>';
                html += '<button class="btn btn-link btn-sm btn-delete-message" data-message-id="' + escapeHtml(msg.id) + '">';
                html += '<i class="fa fa-trash"></i> ' + deleteText;
                html += '</button>';
                html += '</div>';
            }
            html += '</div>';
            html += '<div class="message-meta">';
            html += '<span class="message-date">' + postedBy + ' ' + escapeHtml(msg.name) + ' ' + on + ' ' + date + '</span>';
            if (msg.service) {
                html += '<span class="message-service"> | ' + escapeHtml(msg.service) + '</span>';
            }
            html += '</div>';
            html += '</div>';
            
            // Message content (editable or display)
            html += '<div class="message-content-wrapper">';
            html += '<div class="message-display" id="msg-display-' + escapeHtml(msg.id) + '">';
            if (msg.subject) {
                html += '<div class="message-subject"><strong>' + escapeHtml(msg.subject) + '</strong></div>';
            }
            html += '<div class="message-content">' + escapeHtml(msg.message) + '</div>';
            html += '</div>';
            
            // Edit form (hidden by default)
            html += '<div class="message-edit-form" id="msg-edit-' + escapeHtml(msg.id) + '" style="display: none;">';
            html += '<div class="form-group">';
            html += '<label>' + (getTranslation('leave_message.form.subject') || 'Subject') + '</label>';
            html += '<input type="text" class="form-control edit-subject" value="' + escapeHtml(msg.subject || '') + '" />';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label>' + (getTranslation('leave_message.form.message') || 'Message') + '</label>';
            html += '<textarea class="form-control edit-message" rows="4">' + escapeHtml(msg.message) + '</textarea>';
            html += '</div>';
            html += '<div class="edit-form-actions">';
            html += '<button class="btn btn-skin btn-sm btn-save-edit" data-message-id="' + escapeHtml(msg.id) + '">';
            html += getTranslation('message_board.save') || 'Save';
            html += '</button>';
            html += '<button class="btn btn-default btn-sm btn-cancel-edit" data-message-id="' + escapeHtml(msg.id) + '">';
            html += getTranslation('message_board.cancel') || 'Cancel';
            html += '</button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            
            // Replies section
            if (msg.replies && msg.replies.length > 0) {
                html += '<div class="message-replies">';
                html += '<div class="replies-header"><i class="fa fa-comments"></i> ' + repliesText + ' (' + msg.replies.length + ')</div>';
                msg.replies.forEach(function(reply) {
                    const replyDate = formatDate(reply.timestamp);
                    const replyFrom = getTranslation('message_board.reply_from') || 'Reply from';
                    html += '<div class="reply-item">';
                    html += '<div class="reply-header">';
                    html += '<strong>' + escapeHtml(reply.author || 'TAON Team') + '</strong>';
                    html += '<span class="reply-date">' + replyFrom + ' ' + escapeHtml(reply.author || 'TAON Team') + ' ' + on + ' ' + replyDate + '</span>';
                    html += '</div>';
                    html += '<div class="reply-content">' + escapeHtml(reply.message) + '</div>';
                    html += '</div>';
                });
                html += '</div>';
            }
            
            // Reply form
            html += '<div class="message-reply-section">';
            html += '<button class="btn btn-link btn-reply-toggle" data-message-id="' + escapeHtml(msg.id) + '">';
            html += '<i class="fa fa-reply"></i> ' + replyText;
            html += '</button>';
            html += '<div class="reply-form-container" id="reply-form-' + escapeHtml(msg.id) + '" style="display: none;">';
            html += '<textarea class="form-control reply-textarea" rows="3" placeholder="' + (getTranslation('message_board.reply_placeholder') || 'Write your reply...') + '"></textarea>';
            html += '<div class="reply-form-actions">';
            html += '<button class="btn btn-skin btn-sm btn-reply-submit" data-message-id="' + escapeHtml(msg.id) + '">';
            html += getTranslation('message_board.reply_submit') || 'Submit Reply';
            html += '</button>';
            html += '<button class="btn btn-default btn-sm btn-reply-cancel" data-message-id="' + escapeHtml(msg.id) + '">';
            html += getTranslation('message_board.reply_cancel') || 'Cancel';
            html += '</button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            
            html += '</div>';
        });
        
        listEl.innerHTML = html;
        
        // Setup reply handlers
        setupReplyHandlers();
        
        // Setup edit/delete handlers
        setupEditDeleteHandlers();
    }
    
    // Setup form submission
    function setupFormSubmit() {
        const form = document.getElementById('leave_message_form');
        if (!form) return;
        
        // Remove existing listeners to prevent duplicate submissions
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Prevent duplicate submissions
            if (isSubmitting) {
                return;
            }
            
            const name = document.getElementById('lm_name').value.trim();
            const email = document.getElementById('lm_email').value.trim();
            const subject = document.getElementById('lm_subject').value.trim();
            const message = document.getElementById('lm_message').value.trim();
            
            // Validation
            if (!name || !email || !message) {
                showFormMessage('error', getTranslation('leave_message.error') || 'Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('error', getTranslation('leave_message.error') || 'Please enter a valid email address.');
                return;
            }
            
            // Get service from URL
            const serviceName = getUrlParameter('service') || '';
            
            // Submit message
            const submitBtn = document.getElementById('lm_submit');
            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.textContent = getTranslation('leave_message.form.submit') || 'Sending...';
            
            if (useLocalStorage) {
                // Use localStorage
                setTimeout(function() {
                    try {
                        const data = loadFromLocalStorage();
                        const newMessage = {
                            id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                            name: name,
                            email: email,
                            subject: subject,
                            message: message,
                            service: serviceName,
                            timestamp: new Date().toISOString(),
                            replies: []
                        };
                        
                        data.messages.push(newMessage);
                        
                        if (saveToLocalStorage(data.messages)) {
                            console.log('Message saved successfully to localStorage');
                            submitBtn.disabled = false;
                            submitBtn.textContent = getTranslation('leave_message.form.submit') || 'Submit';
                            showFormMessage('success', getTranslation('leave_message.success') || 'Thank you! Your message has been sent.');
                            newForm.reset();
                            isSubmitting = false;
                            // Reload messages immediately
                            setTimeout(function() {
                                console.log('Reloading messages after submission...');
                                loadMessages(1);
                            }, 300);
                        } else {
                            submitBtn.disabled = false;
                            submitBtn.textContent = getTranslation('leave_message.form.submit') || 'Submit';
                            showFormMessage('error', getTranslation('leave_message.error') || 'Failed to save message.');
                            isSubmitting = false;
                        }
                    } catch (e) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = getTranslation('leave_message.form.submit') || 'Submit';
                        showFormMessage('error', getTranslation('leave_message.error') || 'Failed to save message.');
                        isSubmitting = false;
                        console.error('Failed to save message:', e);
                    }
                }, 300);
            } else {
                // Use PHP API
                $.ajax({
                    url: API_URL,
                    method: 'POST',
                    data: {
                        action: 'add',
                        name: name,
                        email: email,
                        subject: subject,
                        message: message,
                        service: serviceName
                    },
                    dataType: 'json',
                    success: function(response) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = getTranslation('leave_message.form.submit') || 'Submit';
                        isSubmitting = false;
                        
                        if (response.success) {
                            showFormMessage('success', getTranslation('leave_message.success') || 'Thank you! Your message has been sent.');
                            newForm.reset();
                            // Reload messages to show edit/delete buttons
                            setTimeout(function() {
                                loadMessages(1);
                            }, 1000);
                        } else {
                            showFormMessage('error', response.message || getTranslation('leave_message.error') || 'Failed to send message.');
                        }
                    },
                    error: function(xhr, status, error) {
                        isSubmitting = false;
                        submitBtn.disabled = false;
                        submitBtn.textContent = getTranslation('leave_message.form.submit') || 'Submit';
                        showFormMessage('error', getTranslation('leave_message.error') || 'Failed to send message. Please try again.');
                        console.error('Failed to submit message:', error);
                    }
                });
            }
        });
        
        // Update message list when email changes (to show/hide edit/delete buttons)
        const emailField = document.getElementById('lm_email');
        if (emailField) {
            emailField.addEventListener('blur', function() {
                // Reload messages if list is visible
                const listEl = document.getElementById('message-board-list');
                if (listEl && listEl.style.display !== 'none') {
                    loadMessages(currentPage);
                }
            });
        }
    }
    
    // Setup reply handlers
    function setupReplyHandlers() {
        // Reply toggle buttons
        $('.btn-reply-toggle').off('click').on('click', function() {
            const messageId = $(this).data('message-id');
            const formContainer = $('#reply-form-' + messageId);
            formContainer.slideToggle();
        });
        
        // Reply submit buttons
        $('.btn-reply-submit').off('click').on('click', function() {
            const messageId = $(this).data('message-id');
            const textarea = $('#reply-form-' + messageId + ' .reply-textarea');
            const replyText = textarea.val().trim();
            
            if (!replyText) {
                alert(getTranslation('message_board.reply_error') || 'Please enter a reply.');
                return;
            }
            
            const btn = $(this);
            btn.prop('disabled', true);
            btn.text(getTranslation('message_board.reply_submit') || 'Submitting...');
            
            if (useLocalStorage) {
                // Use localStorage
                try {
                    const data = loadFromLocalStorage();
                    const messageIndex = data.messages.findIndex(function(m) { return m.id === messageId; });
                    
                    if (messageIndex === -1) {
                        alert(getTranslation('message_board.reply_error') || 'Message not found.');
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.reply_submit') || 'Submit Reply');
                        return;
                    }
                    
                    if (!data.messages[messageIndex].replies) {
                        data.messages[messageIndex].replies = [];
                    }
                    
                    const reply = {
                        id: 'reply_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        author: 'TAON Team',
                        message: replyText,
                        timestamp: new Date().toISOString()
                    };
                    
                    data.messages[messageIndex].replies.push(reply);
                    
                    if (saveToLocalStorage(data.messages)) {
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.reply_submit') || 'Submit Reply');
                        textarea.val('');
                        $('#reply-form-' + messageId).slideUp();
                        showFormMessage('success', getTranslation('message_board.reply_success') || 'Reply submitted successfully!');
                        setTimeout(function() {
                            loadMessages(currentPage);
                        }, 500);
                    } else {
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.reply_submit') || 'Submit Reply');
                        alert(getTranslation('message_board.reply_error') || 'Failed to save reply.');
                    }
                } catch (e) {
                    btn.prop('disabled', false);
                    btn.text(getTranslation('message_board.reply_submit') || 'Submit Reply');
                    alert(getTranslation('message_board.reply_error') || 'Failed to save reply.');
                    console.error('Failed to save reply:', e);
                }
            } else {
                // Use PHP API
                $.ajax({
                    url: API_URL,
                    method: 'POST',
                    data: {
                        action: 'reply',
                        message_id: messageId,
                        message: replyText,
                        author: 'TAON Team'
                    },
                    dataType: 'json',
                    success: function(response) {
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.reply_submit') || 'Submit Reply');
                        
                        if (response.success) {
                            textarea.val('');
                            $('#reply-form-' + messageId).slideUp();
                            showFormMessage('success', getTranslation('message_board.reply_success') || 'Reply submitted successfully!');
                            // Reload messages
                            setTimeout(function() {
                                loadMessages(currentPage);
                            }, 500);
                        } else {
                            alert(response.message || getTranslation('message_board.reply_error') || 'Failed to submit reply.');
                        }
                    },
                    error: function(xhr, status, error) {
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.reply_submit') || 'Submit Reply');
                        alert(getTranslation('message_board.reply_error') || 'Failed to submit reply. Please try again.');
                        console.error('Failed to submit reply:', error);
                    }
                });
            }
        });
        
        // Reply cancel buttons
        $('.btn-reply-cancel').off('click').on('click', function() {
            const messageId = $(this).data('message-id');
            const formContainer = $('#reply-form-' + messageId);
            formContainer.find('.reply-textarea').val('');
            formContainer.slideUp();
        });
    }
    
    // Setup edit and delete handlers
    function setupEditDeleteHandlers() {
        // Edit buttons
        $('.btn-edit-message').off('click').on('click', function() {
            const messageId = $(this).data('message-id');
            const displayEl = $('#msg-display-' + messageId);
            const editEl = $('#msg-edit-' + messageId);
            
            displayEl.slideUp(function() {
                editEl.slideDown();
            });
        });
        
        // Cancel edit buttons
        $('.btn-cancel-edit').off('click').on('click', function() {
            const messageId = $(this).data('message-id');
            const displayEl = $('#msg-display-' + messageId);
            const editEl = $('#msg-edit-' + messageId);
            
            editEl.slideUp(function() {
                displayEl.slideDown();
            });
        });
        
        // Save edit buttons
        $('.btn-save-edit').off('click').on('click', function() {
            const messageId = $(this).data('message-id');
            const messageItem = $(this).closest('.message-item');
            const email = messageItem.data('message-email');
            const currentEmail = getCurrentUserEmail();
            
            // Verify ownership
            if (!currentEmail || currentEmail.toLowerCase() !== email.toLowerCase()) {
                alert(getTranslation('message_board.not_owner') || 'You can only edit your own messages.');
                return;
            }
            
            const subject = $('#msg-edit-' + messageId + ' .edit-subject').val().trim();
            const message = $('#msg-edit-' + messageId + ' .edit-message').val().trim();
            
            if (!message) {
                alert(getTranslation('leave_message.error') || 'Message cannot be empty.');
                return;
            }
            
            const btn = $(this);
            btn.prop('disabled', true);
            btn.text(getTranslation('message_board.save') || 'Saving...');
            
            if (useLocalStorage) {
                // Use localStorage
                try {
                    const data = loadFromLocalStorage();
                    const messageIndex = data.messages.findIndex(function(m) { return m.id === messageId; });
                    
                    if (messageIndex === -1) {
                        alert(getTranslation('message_board.edit_error') || 'Message not found.');
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.save') || 'Save');
                        return;
                    }
                    
                    // Verify ownership
                    if (data.messages[messageIndex].email.toLowerCase() !== currentEmail.toLowerCase()) {
                        alert(getTranslation('message_board.not_owner') || 'You can only edit your own messages.');
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.save') || 'Save');
                        return;
                    }
                    
                    // Update message
                    data.messages[messageIndex].subject = subject;
                    data.messages[messageIndex].message = message;
                    data.messages[messageIndex].updated_at = new Date().toISOString();
                    
                    if (saveToLocalStorage(data.messages)) {
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.save') || 'Save');
                        showFormMessage('success', getTranslation('message_board.edit_success') || 'Message updated successfully!');
                        setTimeout(function() {
                            loadMessages(currentPage);
                        }, 500);
                    } else {
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.save') || 'Save');
                        alert(getTranslation('message_board.edit_error') || 'Failed to update message.');
                    }
                } catch (e) {
                    btn.prop('disabled', false);
                    btn.text(getTranslation('message_board.save') || 'Save');
                    alert(getTranslation('message_board.edit_error') || 'Failed to update message.');
                    console.error('Failed to update message:', e);
                }
            } else {
                // Use PHP API
                $.ajax({
                    url: API_URL,
                    method: 'POST',
                    data: {
                        action: 'edit',
                        message_id: messageId,
                        email: currentEmail,
                        subject: subject,
                        message: message
                    },
                    dataType: 'json',
                    success: function(response) {
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.save') || 'Save');
                        
                        if (response.success) {
                            showFormMessage('success', getTranslation('message_board.edit_success') || 'Message updated successfully!');
                            // Reload messages
                            setTimeout(function() {
                                loadMessages(currentPage);
                            }, 500);
                        } else {
                            alert(response.message || getTranslation('message_board.edit_error') || 'Failed to update message.');
                        }
                    },
                    error: function(xhr, status, error) {
                        btn.prop('disabled', false);
                        btn.text(getTranslation('message_board.save') || 'Save');
                        alert(getTranslation('message_board.edit_error') || 'Failed to update message. Please try again.');
                        console.error('Failed to update message:', error);
                    }
                });
            }
        });
        
        // Delete buttons
        $('.btn-delete-message').off('click').on('click', function() {
            const messageId = $(this).data('message-id');
            const messageItem = $(this).closest('.message-item');
            const email = messageItem.data('message-email');
            const currentEmail = getCurrentUserEmail();
            
            // Verify ownership
            if (!currentEmail || currentEmail.toLowerCase() !== email.toLowerCase()) {
                alert(getTranslation('message_board.not_owner') || 'You can only delete your own messages.');
                return;
            }
            
            const confirmText = getTranslation('message_board.delete_confirm') || 'Are you sure you want to delete this message?';
            if (!confirm(confirmText)) {
                return;
            }
            
            if (useLocalStorage) {
                // Use localStorage
                try {
                    const data = loadFromLocalStorage();
                    const messageIndex = data.messages.findIndex(function(m) { return m.id === messageId; });
                    
                    if (messageIndex === -1) {
                        alert(getTranslation('message_board.delete_error') || 'Message not found.');
                        return;
                    }
                    
                    // Verify ownership
                    if (data.messages[messageIndex].email.toLowerCase() !== currentEmail.toLowerCase()) {
                        alert(getTranslation('message_board.not_owner') || 'You can only delete your own messages.');
                        return;
                    }
                    
                    // Remove message
                    data.messages.splice(messageIndex, 1);
                    
                    if (saveToLocalStorage(data.messages)) {
                        showFormMessage('success', getTranslation('message_board.delete_success') || 'Message deleted successfully!');
                        setTimeout(function() {
                            loadMessages(currentPage);
                        }, 500);
                    } else {
                        alert(getTranslation('message_board.delete_error') || 'Failed to delete message.');
                    }
                } catch (e) {
                    alert(getTranslation('message_board.delete_error') || 'Failed to delete message.');
                    console.error('Failed to delete message:', e);
                }
            } else {
                // Use PHP API
                $.ajax({
                    url: API_URL,
                    method: 'POST',
                    data: {
                        action: 'delete',
                        message_id: messageId,
                        email: currentEmail
                    },
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            showFormMessage('success', getTranslation('message_board.delete_success') || 'Message deleted successfully!');
                            // Reload messages
                            setTimeout(function() {
                                loadMessages(currentPage);
                            }, 500);
                        } else {
                            alert(response.message || getTranslation('message_board.delete_error') || 'Failed to delete message.');
                        }
                    },
                    error: function(xhr, status, error) {
                        alert(getTranslation('message_board.delete_error') || 'Failed to delete message. Please try again.');
                        console.error('Failed to delete message:', error);
                    }
                });
            }
        });
    }
    
    // Setup refresh button
    function setupRefreshButton() {
        const refreshBtn = document.getElementById('refresh-messages');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                loadMessages(1);
            });
        }
    }
    
    // Setup language change listener
    function setupLanguageChange() {
        document.addEventListener('languageChange', function() {
            // Reload messages to update translations
            if (document.getElementById('message-board-list').style.display !== 'none') {
                loadMessages(currentPage);
            }
        });
    }
    
    // Show form message
    function showFormMessage(type, message) {
        const msgEl = document.getElementById('form-message');
        if (!msgEl) return;
        
        msgEl.className = type === 'success' ? 'success' : 'error';
        msgEl.textContent = message;
        msgEl.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(function() {
            msgEl.style.display = 'none';
        }, 5000);
    }
    
    // Format date
    function formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return days + ' day' + (days > 1 ? 's' : '') + ' ago';
        } else if (hours > 0) {
            return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
        } else if (minutes > 0) {
            return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
        } else {
            return 'Just now';
        }
    }
    
    // Escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
    }
    
    // Get URL parameter
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // Get translation (simple fallback)
    function getTranslation(key) {
        // Try to get from data-i18n elements
        const el = document.querySelector('[data-i18n="' + key + '"]');
        if (el) {
            return el.textContent || el.innerText;
        }
        return null;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also initialize after language switcher loads
    setTimeout(init, 500);
    
})();
