showAllCategory();
function showAllCategory()
{

$("#loader").show();   //Pour afficher le loader avant le chargement de la requette ajax
$.ajax({
    url: "/category/showAllCat",
    method: "GET",
    success:  function(response) {
        $("#loader").hide();    //Masquer le loader apres que les datas sont chargée
        $('#category-table-body').html("");
        const categories = response;
        
        for(var i= 0; i < categories.length; i++)
        {
            const showBtn = ' <button' + 
                        ' class="btn btn-outline-info sm" ' + 
                        ' data-id="' + categories[i].id + '" ' + 
                        ' id="showCategoryBtn">Afficher' +
                        '</button>  ';  
            const editBtn = '<button id="editBtn-' + categories[i].id + 
                            '" class="btn btn-outline-success sm">Editer' +
                            '</button>  ';
            const deleteBtn = '<button' + 
                        ' class="btn btn-outline-danger sm" ' + 
                        ' data-id="' + categories[i].id + '" ' + 
                        ' id="deleteCategoryBtn">Supprimer' +
                        '</button>  ';

            const categoryRow = '<tr>' + 
                                    '<td>' + categories[i].id + '</td>' +
                                    '<td>' + categories[i].name + '</td>'+
                                    '<td style="text-align:center;">'+ showBtn + editBtn + deleteBtn +'</td>' +
                                '</tr>';
            $('#category-table-body').append(categoryRow);
            // const productId = products[i]
            // console.log()
            /***
             * creation d'une fonction pour la mise à jour de produit
             */
            $(document).ready(function() {
                $('#category-table-body').on('click', 'button[id^="editBtn-"]', function() {
                    const id = this.id.split('-')[1];
                    editCategory(id);
                  });
            });
        }
    },
    error: function(response) {
        console.log(response.responseJSON)
    }
});
}

$(document).ready(function() {
    $.ajax({
      url: '/get-categories',
      type: 'GET',
      success: function(categories) {
        for (var i = 0; i < categories.length; i++) {
          var category = categories[i];
          $('#category').append('<option value="' + category.id + '">' + category.name + '</option>');
        }
      } 
    });
  });

// verifier si c'est pour la creation ou pour mettre à jour
$("#save-category-btn").click(function(event) {
    event.preventDefault();
    if($("#update_id").val() == null || $("#update_id").val() == "")
    {
        createCategory();
    } else {
        updateCategory();
    }
})

// fonction qui permet d'afficher le modal de boostrp et 
// effacer les messg flash
$(document).ready(function(){
    $('#createCategory').click(function() {
        $("#categoryForm").modal('show');
        $("#alert-div").html("");
        $("#error-div").html("");
        $("#update_id").val("");
        $("#name").val("");
    })
})

// valider le formulaire et l'envoyer dans la bbd

function createCategory()
{
    $("#save-category-btn").prop('disabled', true);
        const data = {
            name: $("#name").val(),
        };

    $.ajax({
        url: "/category/new",
        method: "POST",
        data: data,
        success: function(response) {
            console.log(response);
            $("#save-category-btn").prop('disabled', false);
            const successHtml = '<div class="alert alert-success" role="alert"> <b>Product crée avec sucess</b></div>';
            $("#alert-div").html(successHtml).slideDown(200).delay(3000).slideUp(200);
            showAllCategory();
            $("#categoryForm").modal("hide");
               // Affichage du message flash
            // $('.flash-message');
        },
        error: function(response) {
            //Gerer les erreurs
            console.log(response)
            $("#save-category-btn").prop('disabled', false);    
            if(typeof response.responseJSON.messages.errors !== 'undefined')
            {
                const errors = response.responseJSON.messages.errors;
                var nameValidation = "";
                if(typeof errors.name !== 'undefined')
                {
                    nameValidation = '<li>' + errors.name + '</li>';
                }

                var errorHtml = '<div class="alert alert-danger" role="alert">' +
                                    '<b> Erreur de Validation </b>' + 
                                    '<ul>' + nameValidation  + '</ul>'+
                                '</div>';
                $("#error-div").html(errorHtml).slideDown(200).delay(3000).slideUp(200);
            }
        }
    });
}

/**
 * editer le produit et recuperer les valeurs du produit
 */
function editCategory(id)
{
    $("#loader").show();
        $.ajax({
        url: "/category/show/" + id,
        method: "GET",
        success: function(response) {
            $("#loader").hide(); 
            const category = response
            $("#alert-div").html("");
            $("#error-div").html("");
            $("#update_id").val(category.id);
            $("#name").val(category.name);
            $("#categoryForm").modal('show');
        }, 
        error: function(response) {
            console.log(response.responseJSON);
        }
    });
}

/**
 * pour valider la modification
 */
function updateCategory()
{   
    $("#loader").show();
    $("#save-category-btn").prop('disabled', true);
    const data = {
        name: $("#name").val(),
    };
    $.ajax({
        url: "/category/edit/" + $("#update_id").val(),
        method: "POST",
        data: data,
        success: function(response) {
            console.log(response)
            $("#loader").hide(); 
            $("#save-category-btn").prop('disabled', false);
            const successHtml = '<div class="alert alert-success" role="alert"> <b>Category modifié avec sucess</b></div>';
            $("#alert-div").html(successHtml);
            showAllCategory();
            $("#categoryForm").modal("hide");
        },
        error: function(response) {
            //Gerer les erreurs
            console.log(response)
            $("#save-category-btn").prop('disabled', false);
            if(typeof response.responseJSON.messages.errors !== 'undefined')
            {
                const errors = response.responseJSON.messages.errors;
                var nameValidation = "";
                if(typeof errors.name !== 'undefined')
                {
                    nameValidation = '<li>' + errors.name + '</li>';
                }

                var errorHtml = '<div class="alert alert-danger" role="alert">' +
                                    '<b> Error de Validation </b>' + 
                                    '<ul>' + nameValidation  + '</ul>'+
                                '</div>';
                $("#error-div").html(errorHtml);
            }
        }
    });
}

/**
 * afficher les data dans le modal
 */
$(document).on("click" , "#showCategoryBtn", function(e) {
    e.preventDefault();
    $("#loader").show();
    $('#name-info').html("");
    var showCategoryBtn = $(this).attr("data-id");
        $.ajax({
            url: "/category/show/" + showCategoryBtn,
            method: "GET",
            success: function(response) {
                $("#loader").hide();
                const category = response;
                $("#name-info").html(category.name);
                $("#view-modalCategory").modal('show');
            },
            error: function(response) {
                console.log(response.responseJSON)
            }
        });
});


/**
 * suppression de produit
 */
$(document).on("click" , "#deleteCategoryBtn", function(e) {
    e.preventDefault();
    if(window.confirm("Voulez vous effacer cette category ?")) {
        var deleteProductBtn = $(this).attr("data-id");
        $.ajax({
            url: "/category/delete/" + deleteProductBtn,
            method: "DELETE",
            success: function(response) {
                const successHtml = '<div class="alert alert-success" role="alert"> <b>Category supprimé avec sucess</b></div>';
                $("#alert-div").html(successHtml).slideDown(200).delay(3000).slideUp(200);
                showAllCategory();
            },
            error: function(response) {
                console.log(response.responseJSON)
            }
        });
    }
})