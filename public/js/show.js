document.getElementById("fileInput").addEventListener("change", function() {
    const uploadLabel = document.getElementById("uploadLabel");
    const loading = document.getElementById("loading");
    
    if (this.files.length > 0) {
      // Hide label and show loading indicator
      uploadLabel.style.display = "none";
      loading.style.display = "block";
    
      // Submit the form automatically
      this.form.submit();
    }
    });
    
    
    document.addEventListener("DOMContentLoaded", function () {
            const editBtn = document.getElementById("editBtn");
            const deleteBtn = document.getElementById("deleteBtn");
    
            function removeOtherButton(clickedBtn) {
                if (clickedBtn === editBtn && deleteBtn) {
                    deleteBtn.remove(); // Remove Delete button if Edit is clicked
                } else if (clickedBtn === deleteBtn && editBtn) {
                    editBtn.remove(); // Remove Edit button if Delete is clicked
                }
            }
    
            if (editBtn) {
                editBtn.addEventListener("click", function () {
                    removeOtherButton(editBtn);
                });
            }
    
            if (deleteBtn) {
                deleteBtn.addEventListener("click", function () {
                    removeOtherButton(deleteBtn);
                    this.closest("form").submit(); // Ensures delete form submits properly
                });
            }
        });
    