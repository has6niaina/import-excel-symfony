showAllProduct();
// recevoir toutes les enregisterement 
function showAllProduct()
{
// console.log("tsay tsay")
$.ajax({
    url: "/product/show-all",
    method: "GET",  
    success:  function(response) {
        $('#product-table-body').html("");
        const products = response;
        
        for(var i= 0; i < products.length; i++)
        {
            const showBtn = ' <button' + 
                        ' class="btn btn-outline-info sm" ' + 
                        ' data-id="' + products[i].id + '" ' + 
                        ' id="showProductBtn">Afficher' +
                        ' </button>  ';
            const editBtn = '<button id="editBtn-' + products[i].id + 
                            '" class="btn btn-outline-success sm">Editer' +
                            '</button>  ';
            const deleteBtn = '<button' + 
                        ' class="btn btn-outline-danger sm" ' + 
                        ' data-id="' + products[i].id + '" ' + 
                        ' id="deleteProductBtn">Supprimer' +
                        '</button>  ';

            const productRow = '<tr>' + 
                                    '<td>' + products[i].id + '</td>' +
                                    '<td>' + products[i].nom + '</td>'+
                                    '<td>' + products[i].description + '</td>' + 
                                    '<td>' + products[i].category + '</td>' + 
                                    '<td>' + '<img src="' + "/uploads/" + products[i].image + '" width="45" height="45"/>' + '</td>' + 
                                    '<td>' + 
                                        '<a href="#" class="open-image-win" data-product-id="' + products[i].id + '">' +
                                            '<img src="' + "build/img/gallery.png" + '" height="40">' +
                                        '</a>' +    
                                    '</td>' + 
                                    '<td style="text-align:center;">'+ showBtn + editBtn + deleteBtn +'</td>' +
                                '</tr>';
            $('#product-table-body').append(productRow);
            // console.log()
            
            /***
             * creation d'une fonction pour la mise à jour de produit
             */
            $(document).ready(function() {
                $('#product-table-body').on('click', 'button[id^="editBtn-"]', function() {
                    const id = this.id.split('-')[1];
                    editProduct(id);
                  });
            });
        }
    },
    error: function(response) {
        console.log(response.responseJSON)
    }
});
}

// verifier si c'est pour la creation ou pour mettre à jour

$("#save-product-btn").click(function(event) {
    event.preventDefault();
    if($("#id").val() == null || $("#id").val() == "")
    {
        createProduct();
    } else {
        updateProduct();
    }
})

// fonction qui permet d'afficher le modal de boostrp et 
// effacer les messg flash
$(document).ready(function(){
    $('#createProduct').click(function() {
        $("#form-modal").modal('show');
        $("#alert-div").html("");
        $("#error-div").html("");
        $("#id").val("");
        $("#nom").val("");
        $("#description").val("");
        $("#category").val("");
        $("#image").val("");
    })
})





function createProduct()
{
    $("#save-product-btn").prop('disabled', true);
    const formData = new FormData();
    formData.append('nom', $("#nom").val());
    formData.append('description', $('#description').val());
    formData.append("category", $("#category").val());
    formData.append('image', $('#image')[0].files[0]);

    $.ajax({
        url: "/product/new",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response);
            $("#save-product-btn").prop('disabled', false);
            const successHtml = '<div class="alert alert-success" role="alert"> <b>Product crée avec sucess</b></div>';
            $("#alert-div").html(successHtml);
            showAllProduct();
            $("#form-modal").modal("hide");
        },
        error: function(response) {
            //Gerer les erreurs
            console.log(response)
            $("#save-product-btn").prop('disabled', false);
            if(typeof response.responseJSON.messages.errors !== 'undefined')
            {
                const errors = response.responseJSON.messages.errors;
                var nomValidation = "";
                if(typeof errors.nom !== 'undefined')
                {
                    nomValidation = '<li>' + errors.nom + '</li>';
                }

                var nomDescription = "";
                if(typeof errors.description !== 'undefined')
                {
                    nomDescription = '<li>' + errors.description + '</li>';
                }

                var errorHtml = '<div class="alert alert-danger" role="alert">' +
                                    '<b> Error de Validation </b>' + 
                                    '<ul>' + nomValidation + descriptionValidation + '</ul>'+
                                '</div>';
                $("#error-div").html(errorHtml);
            }
        }
    });
}

/**
 * editer le produit et recuperer les valeurs du produit
 */
function editProduct(id)
{
        $.ajax({
        url: "/product/show/" + id,
        method: "GET",
        success: function(response) {
            const product = response
            const imageEdit = '<img src="/uploads/' + product.image + '" width="25" height="25"/>'
            $("#alert-div").html("");
            $("#error-div").html("");
            $("#id").val(product.id);
            $("#nom").val(product.nom);
            $("#description").val(product.description);
            $("#category").val(product.category);
            $("#image").val(product.image.name);
            $("#form-modal").modal('show');
        }, 
        error: function(response) {
            console.log(response.responseJSON);
        }
    });
}

/**
 * pour valider la modification
 */
function updateProduct()
{
    $("#save-product-btn").prop('disabled', true);
    const formData = new FormData();
        formData.append('id', $("#id").val());
        formData.append('nom', $("#nom").val());
        formData.append('description', $('#description').val());
        formData.append('category', $('#category').val());
        formData.append('image', $('#image')[0].files[0]);

    $.ajax({
        url: "/product/edit/" + $("#id").val(),
        method: "POST",
        data: formData,
        // dataType: "json",
        contentType: false,
        cache: false,
        processData:false,
        success: function(response) {
            var category = response.data.category;
            console.log(response)
            $("#save-product-btn").prop('disabled', false);
            const successHtml = '<div class="alert alert-success" role="alert"> <b>Product modifié avec sucess</b></div>';
            $("#alert-div").html(successHtml);
            showAllProduct();
            $("#form-modal").modal("hide");
        },
        error: function(response) {
            //Gerer les erreurs
            console.log(response)
            $("#save-product-btn").prop('disabled', false);
            if(typeof response.responseJSON.messages.errors !== 'undefined')
            {
                const errors = response.responseJSON.messages.errors;
                var nomValidation = "";
                if(typeof errors.nom !== 'undefined')
                {
                    nomValidation = '<li>' + errors.nom + '</li>';
                }

                var nomDescription = "";
                if(typeof errors.description !== 'undefined')
                {
                    nomDescription = '<li>' + errors.description + '</li>';
                }

                var errorHtml = '<div class="alert alert-danger" role="alert">' +
                                    '<b> Error de Validation </b>' + 
                                    '<ul>' + nomValidation + descriptionValidation + '</ul>'+
                                '</div>';
                $("#error-div").html(errorHtml);
            }
        }
    });
}

/**
 * afficher les data dans le modal
 */
$(document).on("click" , "#showProductBtn", function(e) {
    e.preventDefault();
    $('#nom-info').html("");
    $('#image-info').html("");
    $('#description-info').html("");
    var showProductBtn = $(this).attr("data-id");
        $.ajax({
            url: "/product/show/" + showProductBtn,
            method: "GET",
            success: function(response) {
                const product = response
                const imageProduct = '<img src="/uploads/' + product.image + '" width="25" height="25"/>'
                $("#nom-info").html(product.nom);
                $("#description-info").html(product.description);
                $("#category-info").html(product.category);
                $("#image-info").html(imageProduct);
                $("#view-modal").modal('show');
                // console.log(product.description)
            },
            error: function(response) {
                console.log(response.responseJSON)
            }
        });
});


/**
 * suppression de produit
 */
$(document).on("click" , "#deleteProductBtn", function(e) {
    e.preventDefault();
    if(window.confirm("Voulez vous effacer cette enregistrement ?")) {
        var deleteProductBtn = $(this).attr("data-id");
        $.ajax({
            url: "/product/delete/" + deleteProductBtn,
            method: "DELETE",
            success: function(response) {
                
                const successHtml = '<div class="alert alert-success" role="alert"> <b>Product supprimé avec sucess</b></div>';
                $("#alert-div").html(successHtml);
                showAllProduct();
            },
            error: function(response) {
                console.log(response.responseJSON)
            }
        });
    }
});

$(document).on('click', '.open-image-win', function() {
    var productId = $(this).data('product-id');
    // alert(productId)
    var url = "/image/new/" + productId;
    var title = "Image Creation";
    var options = "toolbar=no,location=no,directories=0,status=no,top=50,left=100,menuBar=yes,scrollBars=yes,resizable=no,width=900,height=700";
    var newWindow = window.open(url, title, options);
    newWindow.focus();
});

$(document).ready(function (){
    $.uploadPreview({
        input_field: "#image",
        preview_box: "#image-preview",
        label_field: "#image-label",
        label_default: "Choisir une image",
        label_selected: "Changer l'image",
        no_label: false // deja par defaut
    });
});