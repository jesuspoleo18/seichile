/*----------------------------inicio--------------------------------

[Script - principal ]

Projecto:  SEI  - 2018
Version: 0.0.1
Ultimo cambio: 2018/05/16 | 14:45 pm
Asignado a: Implementacion
Primary use: Ecommerce

----------------------

[Tabla de contenido]

1.Inicializacion de controles.
2.Controles generales.
3.Controles de home.
4.Controles de producto.
5.Controles de depto y categ.
6.Controles de cuenta.
7.Controles de Tiendas.


** Recomendaciones para navegacion de tabla de contenido **

[Shortcuts]

1.Ctrl+inicio (regresas a la linea 1 del archivo).
2.Ctrl+fin    (te lleva a la ultima linea del archivo).

-------------------------fin---------------------------------*/


$(function () {
    init();
});

// 1.Inicializacion de controles.

function init() {
    $(document).foundation();
    confiGenerales.init();
    home.init();
    producto.init();
    account.init();
    categDepto.init();
}

// 2.Controles generales.

var confiGenerales = {

    init: function () {
        $(window).load(function () {
            $(".main-loaderContainer").fadeOut("slow");
        });
        confiGenerales.stickyNav('#Widemenu_mobile');
        confiGenerales.triggerSearchMobile();
        confiGenerales.elementosFormato();
        confiGenerales.accordion('.toggle-trigger', '.toggle-container');
        confiGenerales.backTop();
        confiGenerales.copyRigth();
        confiGenerales.wishlistOnclick();
        //confiGenerales.imprimirLista();
        confiGenerales.fraseBusqueda();
        confiGenerales.masterData();
        confiGenerales.miniCartHover();
        confiGenerales.megaMenu('#header, #widemenu, main,.no-megamenu');
        $(window).load(function () {
            confiGenerales.exitLogin();
        });

    },
    miniCartHover: function () {
        let $noSticky = $(".middle-container__content-cart");
        let $sticky = $(".megamenu-container__content-cart");
        $noSticky.hover(function () {
            $(this).find(".v2-vtexsc-cart.vtexsc-cart").addClass("showIt");
        }, function () {
            $(this).find(".v2-vtexsc-cart.vtexsc-cart").removeClass("showIt");
        });
        $sticky.hover(function () {
            $(this).find(".v2-vtexsc-cart.vtexsc-cart").addClass("showIt");
        }, function () {
            $(this).find(".v2-vtexsc-cart.vtexsc-cart").removeClass("showIt");
        });
    },
    stickyNav: function (el) {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 1) {
                $(el).addClass("sticky");
            } else {
                $(el).removeClass("sticky");
            }
        });
    },
    triggerSearchMobile: function () {

        var $triggerSearchMobile = $(".title-bar-right__search .search-button"),
            $closeSearch = $(".search-button-input__closeBar"),
            $input = $(".search-button__input [role='textbox']"),
            $c = $(".search-button__input");

        $triggerSearchMobile.on("click", function (e) {
            e.preventDefault();
            $c.toggleClass("active");
            $input.focus();
        });

        $closeSearch.on("click", function (e) {
            e.preventDefault();
            $c.removeClass("active");
        });
    },
    masterData: function () {

        $('#form_Newsletter').submit(function (e) {
            e.preventDefault();
            Newsletter();
        });
        $('.scl_contactForm-container').submit(function (e) {
            e.preventDefault();
            ContactForm();
        });

        function Newsletter() {

            var datos = {};

            datos.cp_name = $('#cp_name').val();
            datos.cp_email = $('#cp_email').val();

            $.ajax({
                accept: 'application/vnd.vtex.ds.v10+json',
                contentType: 'application/json; charset=utf-8',
                crossDomain: true,
                data: JSON.stringify(datos),
                type: 'POST',
                url: '//api.vtexcrm.com.br/seicl/dataentities/NL/documents',

                success: function (data) {
                    document.getElementById('form_Newsletter').reset();
                    //$('#NewsAprob').foundation('open');
                    swal({
                        title: '¡Gracias!',
                        html: "Tus datos han sido enviados.",
                        type: 'success',
                        confirmButtonColor: '#be2912',
                        confirmButtonText: 'Volver al sitio'
                    });
                },

                error: function (data) {
                    //$('#NewsError').foundation('open');
                    swal({
                        title: 'Error',
                        html: "El formulario no ha podido registrar tus datos. <br> Prueba completando nuevamente en todos los campos correspondientes de forma correcta. ",
                        type: 'error',
                        confirmButtonColor: '#be2912',
                        confirmButtonText: 'Volver'
                    });
                }
            });
        }

        function ContactForm() {

            var datos = {};

            datos.scl_contacto_nombres = $('#scl_contacto_nombres').val();
            datos.scl_contacto_apellidos = $('#scl_contacto_apellidos').val();
            datos.scl_contacto_email = $("#scl_contacto_email").val();
            datos.scl_contacto_telefono = $("#scl_contacto_telefono").val();
            datos.scl_contacto_asunto = $("#scl_contacto_asunto").val();
            datos.scl_contacto_motivo = $("#scl_contacto_motivo").val();

            $.ajax({
                accept: 'application/vnd.vtex.ds.v10+json',
                contentType: 'application/json; charset=utf-8',
                crossDomain: true,
                data: JSON.stringify(datos),
                type: 'POST',
                url: '//api.vtexcrm.com.br/seicl/dataentities/SC/documents',
                success: function (data) {
                    $(".scl_contactForm-container input[type='text'],.scl_contactForm-container input[type='email'],.scl_contactForm-container textarea").val('');
                    //$('#NewsAprob').foundation('open');
                    swal({
                        title: '¡Gracias!',
                        html: "Tus datos han sido enviados.",
                        type: 'success',
                        confirmButtonColor: '#be2912',
                        confirmButtonText: 'Volver al sitio'
                    });
                },
                error: function (data) {
                    //$('#NewsError').foundation('open');
                    swal({
                        title: 'Error',
                        html: "El formulario no ha podido registrar tus datos. <br> Prueba completando nuevamente en todos los campos correspondientes de forma correcta. ",
                        type: 'error',
                        confirmButtonColor: '#be2912',
                        confirmButtonText: 'Volver'
                    });
                }
            });
        }
    },
    FormatoDecimales: function (seletor) {

        $(seletor).each(function () {

            var novoConteudoPreco = $(this).text();

            if (novoConteudoPreco.indexOf(',') > -1) {

                var padrao = /(\$[\s0-9.]*)([,0-9]+)/gm;

                novoConteudoPreco = novoConteudoPreco.replace(padrao, '$1');
                $(this).html(novoConteudoPreco);

            }

        });

    },
    elementosFormato: function () {

        var $ajaxStopElems = '.skuListPrice, .skuBestPrice, .bestPrice, .oldPrice, .price-best-price, .skuBestInstallmentValue, em.total-cart-em, span.vtexsc-text, td.monetary, span.best-price.new-product-price, td.quantity-price.hidden-phone.hidden-tablet,span.payment-value-monetary,span.payment-installments, .producto-prateleira__info--bestPrice div, .producto-prateleira__info--oldPrice div, .giftlistproductsv2 td';
        var $porcentaje = $('.porcentaje');
        var porcentaje = function (el) {
            $(el).each(function () {
                var valor = $(this).text();
                if (valor == 0) {
                    $(this).remove();
                } else {
                    $(this).text(valor.replace(',0', ''));
                }
            });
        };
        confiGenerales.FormatoDecimales($ajaxStopElems);
        // porcentaje('.porcentaje-content');
        $(document).ajaxStop(function () {
            confiGenerales.FormatoDecimales($ajaxStopElems);
            // porcentaje('.porcentaje-content');
        });

        // if ($porcentaje.lenght) {
        //     $porcentaje.each(function () {
        //         var valor = $(this).text();
        //         if (valor == 0) {
        //             $(this).remove();
        //         } else {
        //             $(this).text(valor.split(',')[0] + '%');
        //         }
        //     });
        // } else {
        //     console.log("porcentaje desactivado");
        // }
    },
    accordion: function (trigger, content) {

        var $responsive = $(window).width();

        if ($responsive < 640) {

            console.log("accordion");

            $(content).hide();

            $(trigger).click(function () {
                $(this).toggleClass("active").next().slideToggle("slow");
                return false;
            });
        } else {
            $(content).show();
        }

    },
    backTop: function () {

        var offset = 300,
            offset_opacity = 1200,
            scroll_top_duration = 700,
            $back_to_top = $('.back-to-top');

        //hide or show the "back to top" link
        $(window).scroll(function () {

            if ($(this).scrollTop() > offset) {
                $back_to_top.addClass('back-to-top-is-visible');
            } else {
                $back_to_top.removeClass('back-to-top-is-visible back-to-top-fade-out');
            }

            if ($(this).scrollTop() > offset_opacity) {
                $back_to_top.addClass('back-to-top-fade-out');
            }
        });

        //smooth scroll to top
        $back_to_top.on('click', function (event) {

            event.preventDefault();

            $('body,html').animate({
                scrollTop: 0,
            }, scroll_top_duration);
        });

    },
    copyRigth: function () {

        $(".footer-copyright span").append("Copyright" + " " + (new Date()).getFullYear() + "," + " " +
            "SEI");

    },
    wishlistOnclick: function () {

        var loginCheck = {
                login: ""
            },
            // $img = $(".producto-prateleira__info--wishlist img"),
            $mainContent = $(".producto-prateleira__info");

        vtexjs.checkout.getOrderForm().done(function (orderForm) {

            loginCheck.login = orderForm.loggedIn;

            console.log("cliente logeado:" + " " + orderForm.loggedIn);

            if (loginCheck.login == true) {

                var $a = $(".login-wishlist"),
                    $checkActive = $(".producto-prateleira__info--wishlist .product-insertsku");

                $a.remove();
                $checkActive.addClass('active');

                console.log("estás registrado");

                // $img.addClass('active');

                $mainContent.each(function () {

                    var $btnWishlist = $(this).find(".insert-sku-checkbox");

                    $btnWishlist.on("change", function () {

                        if ($(this).is(":checked")) {
                            $(".glis-popup-link").click();
                        } else {
                            console.log("no estoy capturando el evento");
                        }

                    });

                });

            } else if (loginCheck.login == false) {

                console.log("no estás registrado");

                $mainContent.each(function () {

                    var $el = $(".producto-prateleira__info--wishlist"),
                        $noLoginTemplate = '<div class="login-wishlist"> <a class="login-wishlist__trigger"></a> </div>',
                        $loginBtn = $(".ajax-content-loader").find(".glis-link.must-login").attr('href'),
                        $find = $(this).find($el);

                    // console.log($wishBtn);

                    $find.html($noLoginTemplate);

                    var $btn = $(this).find(".login-wishlist__trigger");

                    $btn.on("click", function () {

                        console.log($loginBtn);
                        // window.location.href = "/login?ReturnUrl=%2f";

                        swal({
                            title: 'Debes estar registrado para añadir a tus favoritos.',
                            type: 'info',
                            confirmButtonColor: '#EE5D79',
                            cancelButtonColor: '#1E1B1C',
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Login',
                            showCancelButton: true,
                            onOpen: function (swal) {
                                $(swal).find('.swal2-confirm').off().click(function (e) {
                                    // window.open('/checkout/');
                                    window.location.href = "/login?ReturnUrl=%2f";
                                });
                            }
                        });

                    });

                });

            }

        });

    },
    imprimirLista: function () {

        var $wishlist = $(".wishlist");

        if ($wishlist.length) {

            var objeto = document.getElementById('giftlistproduct'),
                ventana = window.open('', '_blank');

            ventana.document.write(objeto.innerHTML);
            ventana.document.close();
            ventana.print();
            ventana.close();

        }

    },
    fraseBusqueda: function () {

        var $buscavazia = $(".resultado-busca");

        if ($buscavazia.length) {

            var href = window.location.href,
                url = href.split('=')[1],
                $el = $(".frase__content");

            $el.append(url);
        }

    },
    exitLogin: function () {

        $('#vtexIdContainer .modal-header .close').attr('onclick', 'window.history.go(-1);return false;');

    },
    megaMenu: (exit) => {

        if ($(window).width() > 768) {

            let $navigationMenuItem = $('.Widemenu_title');
            let $megamenu = $(".Widemenu__container");

            $navigationMenuItem.each(function () {
                let _thisNavigationMenuItem = $(this);

                _thisNavigationMenuItem.on("mouseenter", function () {

                    let $menuItemAttr = _thisNavigationMenuItem.attr("class");
                    let menuItemAttr = $.trim($menuItemAttr.split("title")[1]);

                    confiGenerales.menuItems(_thisNavigationMenuItem, exit);

                    $megamenu.each(function () {
                        let $megamenuAttr = $(this).attr("class");
                        let megamenuAttr = $.trim($megamenuAttr.split("container")[1]);

                        if (menuItemAttr.indexOf(megamenuAttr) > -1) {
                            $(this).addClass('display');
                            $(this).siblings().removeClass('display');
                        }
                    });
                });
            });

            $(exit).on("mouseenter", function () {
                $megamenu.removeClass("display");
            });

        }
    },
    menuItems: (ele, exit) => {
        ele.addClass("active");
        ele.siblings().removeClass("active");

        $(exit).on("hover", function () {
            ele.removeClass("active");
            $(exit).removeClass("active");
        });
    }
};

// 3.Controles de home.

var home = {

    init: function () {
        home.slideHome('.home-slide', '.carousel-destacados');
    },

    //SLIDE HOME
    slideHome: function (uno, dos) {

        var $home = $(".home");

        if ($home.length) {

            $(".helperComplement").remove();
            $(".home-destacados .prateleira").children().next().addClass("carousel-destacados");

            $(uno).slick({
                dots: true,
                arrows: true,
                autoplay: true,
                autoplaySpeed: 5000,
                prevArrow: '<button type="button" class="slick-arrow slick-prev icon-sei_Slide trsn"></button>',
                nextArrow: '<button type="button" class="slick-arrow slick-next icon-sei_Slide trsn"></button>',
                infinite: true,
                speed: 500,
                cssEase: 'linear'
            });

            $(dos).slick({
                dots: false,
                arrows: true,
                autoplay: false,
                autoplaySpeed: 5000,
                slidesToScroll: 1,
                slidesToShow: 4,
                prevArrow: '<button type="button" class="slick-arrow slick-prev arrowSlideHome trsn"></button>',
                nextArrow: '<button type="button" class="slick-arrow slick-next arrowSlideHome trsn"></button>',
                infinite: true,
                speed: 500,
                cssEase: 'linear',
                responsive: [{
                        breakpoint: 980,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 650,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

        }
    }

};

// 4.Controles de producto.
var producto = {

    init: function () {
        var $producto = $("body.produto");
        if ($producto.length) {
            producto.qtdControl();
            producto.sizeNecessary();
            producto.skuOnChange();
            producto.noStock();
            producto.checkForSkus();
        }
    },
    checkForSkus: function () {
        let $input = $(".product__tallas").find('input');
        if ($input.length == 0) {
            $(".product__tallas").remove();
        }
    },
    noStock: function () {
        let $a = $(".buy-button.buy-button-ref");
        let $body = $("body");
        let $ref = $(".product__ean");
        let template = '<p class="product__no-stock">Producto no disponible</p>';
        if ($a.css('display') == 'none') {
            $body.addClass('no-stock');
            $ref.after(template);
            return true;
        } else {
            $body.removeClass('no-stock');
            return false;
        }
    },
    skuOnChange: function () {
        let $skuSelector = $(".skuselector-specification-label");
        $skuSelector.on("click", function () {
            vtexjs.catalog.getCurrentProductWithVariations().done(function (product) {
                setTimeout(function () {
                    producto.noStock();
                    confiGenerales.elementosFormato();
                }, 500);
            });
        });
    },
    qtdControl: function () {

        var $btnComprarProduto = $('.buy-button.buy-button-ref');
        var $notifyme = $(this).find(".notifyme.sku-notifyme:visible");
        var $templateQty = '<div class="pull-left box-qtd">' + '<div class="bts pull-right">' + '<button class="btn btn-mais">+</button>' + '</div>' + '<input type="text" class="qtd pull-left" value="1" />' + '<div class="bts pull-left">' + '<button class="btn btn-menos">-</button>' + '</div>' + '</div>';
        var $recebeQtyForm = $('.product__sku-container, .product__shop-content');
        var amountProduct;

        if ($btnComprarProduto.length) {
            if ($recebeQtyForm.length) {
                vtexjs.catalog.getCurrentProductWithVariations().done(function (product) {
                    amountProduct = product.skus[0].availablequantity;
                });
                $recebeQtyForm.prepend($templateQty);
            }
        }
        producto.assignQtd(amountProduct);
    },
    assignQtd: function (qty) {
        var $document = $(document);
        $document.on('click', '.product__shop-content .box-qtd .btn', function () {

            var $this = $(this);
            var $qtd = $('.product__shop-content .box-qtd .qtd');
            var valor = parseInt($qtd.val());

            if ($this.hasClass('btn-mais')) {
                $qtd.val(valor + 1);
                if (parseInt($('.product__shop-content .box-qtd .qtd').val()) === qty) {
                    console.log("tope de cantidad");
                    $(".btn-mais").prop('disabled', true);
                } else {
                    console.log("no se está ejecutando el anterior");
                }

            } else if ($this.hasClass('btn-menos')) {
                if (valor > 1) {
                    $qtd.val(valor - 1);
                    $(".btn-mais").removeAttr('disabled');
                }
            }

        });
    },
    sizeNecessary: function () {
        $(".buy-button.buy-button-ref").click(function () {
            if ($(this).attr('href') === "javascript:alert('Por favor, selecione o modelo desejado.');") {
                //$('#sizeNecessary').foundation('open');
                swal({
                    html: "Debes seleccionar una talla.",
                    type: 'info',
                    confirmButtonColor: '#ee5d79'
                });
                return false;

            } else {
                var url = $(this).attr('href').split("?")[1];
                var param = url.split("&");
                var $widemenu = $("#widemenu .middle-container__content-cart");
                var item = {
                    id: param[0].split("=")[1],
                    quantity: param[1].split("=")[1],
                    seller: param[2].split("=")[1]
                };
                vtexjs.checkout.addToCart([item], null, 1).done(function (orderForm) {

                    swal({
                        html: "PRODUCTO AÑADIDO CON ÉXITO.",
                        type: 'success',
                        confirmButtonColor: '#182b5b',
                        confirmButtonText: 'Volver al sitio',
                        timer: 2000
                    });

                    $(".portal-minicart-ref .cartFooter a").attr("href", "/checkout/#/cart");

                    $widemenu.addClass("showIT");

                    if ($("#widemenu .middle-container__content-cart.showIT").length > 0) {

                        console.log("lo tiene");
                        setTimeout(function () {
                            $("#widemenu .middle-container__content-cart.showIT").removeClass("showIT");
                        }, 3000);

                    } else {
                        console.log("no lo tiene");
                    }

                });


            }

            return false;
        });
    }

};

// 5.Controles de depto y categ.
var categDepto = {
    init: function () {
        var $accepted = $(".categoria");
        if ($accepted.length) {
            categDepto.findGiftIdeas();
            console.log("control de categDepto cargado");
        }
    },
    findGiftIdeas: function () {
        var template = '<h3 class="Hide HideRango-de-Precio">Para una Mujer</h3> <ul class="Rango de Precio "> <li> <a href="/De%20Estilo%20Étnico?PS=20&amp;map=c,specificationFilter_28" class="Widemenu__menu-items hasFlag">De estilo étnico</a> </li> <li> <a href="/Versátil%20y%20Dinámica?PS=20&amp;map=c,specificationFilter_28" class="Widemenu__menu-items">Vérsatil y dinámica</a> </li> <li> <a href="/Romántica?PS=20&amp;map=c,specificationFilter_28" class="Widemenu__menu-items">Romantica</a> </li> <li> <a href="/Glamorosa?PS=20&amp;map=c,specificationFilter_28" class="Widemenu__menu-items">Glamorosa</a> </li> <li> <a href="/Clásica?PS=20&amp;map=c,specificationFilter_28" class="Widemenu__menu-items">Clásica</a> </li> </ul> <h3 class="Hide HideRango-de-Precio"> Rango de Precio </h3> <ul class="Rango de Precio "> <li> <a href="/ideas-de-regalo/de-0-a-12990?PS=20&amp;map=c,priceFrom" title="hasta $12.990">hasta $12.990 (168)</a> </li> <li> <a href="/ideas-de-regalo/de-13000-a-24990?PS=20&amp;map=c,priceFrom" title="hasta $24.990">hasta $24.990 (16)</a> </li> <li class="last"> <a href="/ideas-de-regalo/de-25000-a-36990?PS=20&amp;map=c,priceFrom" title="hasta $36.990">hasta $36.990 (125)</a> </li> </ul>';
        var $locationPathname = window.location.pathname;
        var $searchNavigator = $(".search-single-navigator");

        if ($locationPathname == '/ideas-de-regalo') {
            $searchNavigator.append(template);
        }
    }
};

//WISHLIST - CREATE 
$(document).ready(function () {
    //REPEAT INPUT CREATE LIST
    $("#giftlistname").keyup(function () {
        var value = $(this).val();
        $("#giftlisturl").val(value);
        console.log("cargadoWish");
    });

    //CHECK ACCEPT CREATE LIST
    $("#giftlistaccept").attr("checked", "checked");
});

var regiones = [],
    comunas = [],
    country = 'CHL';

var account = {

    init: function () {

        var $account = $("body.account");

        if ($account.length) {

            account.loadRegionComuna();
            account.addresUpdate();
            account.addresDeletePop();
            account.addresDeleteClick();
            account.showContentAccount();
            setInterval(account.traducciones, 2000);

            $('#formAddressNew').submit(function (e) {

                e.preventDefault();
                account.createAddress();

            });
            console.log("controles generales");
        }

    },

    traducciones: function () {

        var $apellido = $(".profile-detail-display-nickname .title:contains('Apelido:')"),
            $telefono = $(".profile-detail-display-cellphone .title:contains('Telefone Comercial')");

        $apellido.text('Apellido:' + ' ');
        $telefono.text('Teléfono Comercial:' + ' ');

    },

    loadRegionComuna: function () {

        $.ajax({

            type: "GET",
            dataType: 'html',
            url: 'https://io.vtex.com.br/front.shipping-data/2.20.11/script/rule/CountryCHL.js',

            success: function (response) {

                var data = response.split("this.map="),
                    json = data[1].split("}}")[0];

                json = json + "}}";
                json = json.split('"').join('');
                json = json.split('{').join('{"');
                json = json.split(':').join('":');
                json = json.split(',').join(',"');

                data = $.parseJSON(json);
                //console.log(data);

                for (var region in data) {
                    regiones.push({
                        id: region,
                        nombre: region
                    });
                    for (var comuna in data[region]) {
                        comunas.push({
                            id: comuna,
                            id_region: region,
                            nombre: comuna,
                            codigo: (data[region])[comuna]
                        });
                    }
                }

                $.each(regiones, function (index, value) {
                    if (index == 0) {
                        $("#cmbRegion").append(new Option("-- Seleccione una Región --", ""));
                        $("#cmbComuna").append(new Option("-- Seleccione una Comuna --", ""));
                    }
                    $("#cmbRegion").append(new Option(value.nombre, value.id));
                });

                $("#cmbRegion").change(function () {
                    var id = $(this).val();
                    $('#cmbComuna').find('option').remove().end().append(new Option("-- Seleccione una Comuna --", ""));

                    if (id != undefined && id != null && id != "") {
                        $.each(comunas, function (index, value) {
                            if (value.id_region == id)
                                $("#cmbComuna").append(new Option(value.nombre, value.codigo));

                        });

                        $("#cmbComuna").change(function () {
                            var _this = this;

                            if ($(this).val() != "") {
                                var comuna = comunas.find(function (c) {
                                    return c.codigo == $(_this).val();
                                });
                                $("#spnNombreComuna").text(comuna.nombre);
                            } else {}
                        });
                    }
                });
            }

        });

    },

    createAddress: function () {

        var addressName = $('#aliasDireccion').val(),
            // country = $("meta[name='country']").attr("content"),
            receiverName = $('#destinatario').val(),
            addressType = '1',
            postalCode = $('#cmbComuna').val(),
            street = $('#direccion').val(),
            number = $('#numeroDireccion').val(),
            neighborhood = $('#spnNombreComuna').text(),
            city = '-',
            country = $('#country').val(),
            complement = $('#pisoDireccion').val(),
            reference = '-',
            state = $('#cmbRegion').val(),
            userId = $('#userId').val(),
            addressId = $('#addressId').val(),
            dataString =
            'addressName=' + addressName +
            '&receiverName=' + receiverName +
            '&addressType=' + addressType +
            '&postalCode=' + postalCode +
            '&street=' + street +
            '&number=' + number +
            '&complement=' + complement +
            '&reference=' + reference +
            '&neighborhood=' + neighborhood +
            '&city=' + city +
            '&state=' + state +
            '&country=' + country +
            '&userId=' + userId +
            '&addressId=' + addressId;
        //alert (dataString); return false;

        $.ajax({

            type: "POST",
            url: "/no-cache/account/address/save",
            data: dataString,

            success: function (data) {

                // document.getElementById('newsLetter_form').reset();
                $('#addressAprob').foundation('open');

                $(document).click(function () {
                    location.reload();
                });

            },

            error: function (data) {

                $('#addressError').foundation('open');

                $(document).click(function () {
                    location.reload();
                });
            }

        });

    },

    addresUpdate: function () {

        $(".address-update").on("click", function () {

            var addressName = $(this).attr('data-addressname');

            if (addressName == "") {

                $('#aliasDireccion').val("");
                $('#destinatario').val("");
                $('1');
                $('#cmbComuna').val("");
                $('#direccion').val("");
                $('#numeroDireccion').val("");
                $('#pisoDireccion').val("");
                $('-');
                $('-');
                $('span#spnNombreComuna').text();
                $('#cmbRegion').val("");
                $('#addressId').val("");
            } else {

                $.ajax({

                    dataType: "json",
                    url: "/no-cache/account/address/detail/" + addressName,

                    success: function (data) {

                        $('#aliasDireccion').val(data.addressName);
                        $('#destinatario').val(data.receiverName);
                        $('1');
                        $('#cmbComuna').val(data.city);
                        $('#direccion').val(data.street);
                        $('#numeroDireccion').val(data.number);
                        $('#pisoDireccion').val(data.complement);
                        $('-');
                        $('-');
                        $('span#spnNombreComuna').text(data.spnNombreComuna);
                        $('#cmbRegion').val(data.state);
                        $('#addressId').val(encodeURIComponent(data.addressName));
                    },

                    error: function () {

                        $('#addressError').foundation('open');
                        $(document).click(function () {
                            location.reload();
                        });

                    }

                });
            }

        });

    },

    addresDeletePop: function () {

        $(".delete").on("click", function () {

            var addressName = $(this).attr('data-addressname'),
                replaced = "Desea eliminar esta direccion: " + addressName + "?";

            $("#exclude-message").html(replaced);
            $("#address-delete").attr('data-addressname', addressName);
        });

    },

    addresDeleteClick: function () {

        $("#address-delete").on("click", function () {

            var addressName = $(this).attr('data-addressname');

            if (addressName == "") {

                $('#addressError').foundation('open');

                $(document).click(function () {
                    location.reload();
                });

            } else {

                $.ajax({
                    type: "GET",
                    url: "/no-cache/account/address/delete/" + addressName,

                    success: function () {
                        $('#addressDelete').foundation('open');
                        $(document).click(function () {
                            location.reload();
                        });
                    },
                    error: function () {
                        $('#addressError').foundation('open');
                        $(document).click(function () {
                            location.reload();
                        });
                    }
                });
            }

        });

    },

    showContentAccount: function () {

        init();

        function init() {

            profileUser();
            openClose();
            addresEdit();
            addresDelete();
            console.log("controles para edicion de cuenta");
        }

        function profileUser() {

            $(".edit-profile-link a").attr("data-open", "editar-perfil").removeAttr("id").removeAttr("data-toggle");
            $("#editar-perfil").attr("data-reveal", "").attr("class", "reveal").attr("data-reveal-ajax", "true").removeAttr("tabindex").removeAttr("style");
            $(".modal-header button").attr("class", "close-button").attr("data-close", "").attr("aria-label", "Close modal").removeAttr("data-dismiss");

        }

        function openClose() {

            $(".edit-profile-link a").on("click", function () {
                var popup = new Foundation.Reveal($('#editar-perfil'));
                popup.open();
                return false;
            });

            $("#profile .save-cancel-buttons button").attr("data-close", "").attr("aria-label", "Close modal");

        }

        function addresEdit() {

            $(".new-address-link a, .edit-address-link a.address-update").attr("data-open", "AddressNew").attr("aria-controls", "AddressNew").attr("aria-haspopup", "true").attr("tabindex", "0").removeAttr("id").removeAttr("data-toggle").removeAttr("href");

            $("#form-address .save-cancel-buttons button").attr("data-close", "").attr("aria-label", "Close modal");

            $("#addressName").keyup(function () {
                var value = $(this).val();
                $("#receiverName").val(value);
                $("#city").val(value);
            });

            //delete address
            $(".edit-address-link a.delete").attr("href", "#").attr("data-open", "address-remove").removeAttr("id").removeAttr("data-toggle");
            $("#address-remove").attr("data-reveal", "").attr("class", "reveal").attr("data-reveal-ajax", "true").removeAttr("tabindex").removeAttr("style");

            //open modal delete
            $(".edit-address-link a.delete").click(function () {
                var popup = new Foundation.Reveal($('#address-remove'));
                popup.open();
                return false;
            });

            //close modal address
            $("#exclude .save-cancel-buttons button").attr("data-close", "").attr("aria-label", "Close modal");

            //addclass trns
            $(".save-cancel-buttons input#profile-submit, .save-cancel-buttons button.btn-link").addClass("trsn");

        }

        function addresDelete() {

            //address delete exclude click
            $("#address-delete").on("click", function () {

                var addressName = $(this).attr('data-addressname');

                if (addressName == "") {

                    $('#exclude').css('visibility', 'hidden');
                    $('#address-remove').html("<h4>Ha ocurrido un error (addressName). Por favor, intenta nuevamente.</h4>");

                    $('#address-remove').fadeOut(3500, function () {
                        location.reload();
                    });

                } else {

                    $.ajax({
                        type: "GET",
                        url: "/no-cache/account/address/delete/" + addressName,
                        success: function () {
                            $('#exclude').css('visibility', 'hidden');
                            $('#address-remove').html("<h4>Dirección eliminada con éxito!</h4>");
                            $('#address-remove').fadeOut(2200, function () {
                                location.reload();
                            });
                        },
                        error: function () {
                            $('#exclude').css('visibility', 'hidden');
                            $('#address-remove').html("<h4>Ha ocurrido un error inesperado. Por favor, intenta nuevamente.</h4>");
                            $('#address-remove').fadeOut(3500, function () {
                                location.reload();
                            });
                        }
                    });

                }

            });

            $('.address-label').text("Nueva Dirección");

            //address delete open pop
            $(".delete").on("click", function () {

                var addressName = $(this).attr('data-addressname'),
                    replaced = "Realmente desea eliminar esta dirección " + addressName + "?";

                $("#exclude-message").html(replaced);
                $("#address-delete").attr('data-addressname', addressName);

            });

        }

    }

};