ULAKBUS API-UI Etkileşimi
=========================

.. figure:: http://ulakbus.net/img/brand-logo.png :alt: Ulakbus_logo

Bu belge **Ulakbus API ve UI** bileşenlerinin etkileşimini göstermek için hazırlanmıştır. API kullanılarak hazırlanan
view, model ve jenerik fonksiyonlarda hangi tip verinin kullanıcı arayüzünde nasıl gösterildiğini bu belgede
bulabilirsiniz.

Genel
~~~~~

Ulakbus kullanıcı arayüzü yapacağı işlemlerle ilgili komutları API'dan alacak şekilde kurgulanmıştır.

İş akış şemaları yani *workflow* lar bpmn formatında backend API'da oluşturulur.

İş akışının arayüzde akışa uygun şekilde gerçekleştirilmesi için kullanılacak anahtar-değerler ( *key-value* ) API
tarafından ``response`` nesnesinde arayüze gönderilir ve arayüz tarafından yorumlanır.

API'ın ``Response`` nesnesinde sayfaların yorumladığı datanın (``forms``, ``objects``, ``object``) dışında kullanıcı arayüzünü şekillendiren, işlev ekleyen bazı anahtarlar bulunmaktadır. Bunlar aşağıdaki örnekte sıralanmıştır;

.. code:: json

    {
        "client_cmd":["form"],
        "reload_cmd":"add_edit_form",
        "token":"zxcv4321",
        "meta":{
            "allow_search":true,
            "allow_selection":false
        },
        "_debug_queries":[
            {
                "TIMESTAMP":1453289218.893847,
                "BUCKET":"models_user",
                "KEY":"7890yuhjk",
                "TIME":0.00275
            }
        ],
        "is_login":true
    }

client_cmd
^^^^^^^^^^

``client_cmd`` anahtarı arayüzün yapması istenen komutu taşır. Bu komutlar şunları kapsar; **list**, **form**, **show**,
**reload**, **reset**.

- **form** gönderilen datanın `forms` nesnesi taşıdığı ve kullanıcı arayüzünün bunu form olarak yorumlaması gerektiği durumlarda kullanılır.
- **list** sayfada listelenmesi istenen bir data olduğunda kullanılır. Bu data *table* olarak listelenir.
- **show** komutu sayfada detay bilgileriyle gösterilmek istenen bır data olduğunda kullanılır.
- **reload** komutu sayfada gösterilen datada bir değişiklik olduğu ve datanın API'dan yeniden istenmesi gerektiği durumlarda kullanılır.
- **reset** komutu datanın ek parametreler olmadan yeniden çekilmesi için kullanılır.

Bu komutlar oluşturulan workflow'ların ilgili adımlarında kullanılarak arayüzün istenen şekilde davranması için
gereklidir.

    **form**, **list** ve **show** komutları birer liste öğesi olarak bir arada gönderilebilir.


reload_cmd
^^^^^^^^^^

``reload_cmd`` anahtarı ``"client_cmd": "reload"`` olması durumunda arayüzün backend API'dan isteyeceği komutu taşır. UI post datası içinde ``cmd`` anahtarında bu değeri gönderir.

token
^^^^^

``token`` anahtarında iş akış şemasının ( *workflow* ) redis'te tutulan token değeri vardır. İş akışı tamamlanmadığı sürece bu token `request` nesnesinde API'a gönderilir.

meta
^^^^

``meta`` anahtarında arayüzde istenen yapılandırmalar yer alır. Boolean değer taşırlar. Bunlar şunlardır;

- **allow_search** Listeleme ekranında arama kutusunun gösterilmesi için kullanılır.
- **allow_selection** Listeleme ekranında tablonun solunda selectBox yer alması için kullanılır.
- **allow_sort** Listeleme ekranındaki sıralama özelliği için kullanılır.
- **allow_filter** Listelenen datanın filtrelemesi için kullanılır.
- **allow_actions** ListNode tipinde listelenen data için en sağdaki işlemler kolonunun gösterilmesi için kullanılır.

_debug_queries
^^^^^^^^^^^^^^

``_debug_queries`` anahtarı geliştiriciler için yardımcı bir anahtardır. Veritabanına yapılan sorguların süresi ve kaç adet sorgu yapıldığı gibi değerler bu anahtarda yer alır.
Aktif olması için API ortamında çevre değişkeni DEBUG=1 olarak set edilmelidir.

is_login
^^^^^^^^

``is_login`` anahtarı kullanıcının giriş yapıp yapmadığını gösteren bir anahtardır.
Bu anahtar *false* değer taşıdığında arayüz login sayfasına yönlendirir.


Ulakbüs UI Sayfa Tipleri
------------------------

Ulakbüs kullanıcı arayüzünde sunulan temel içerik türleri şunlardır;

-  Form sayfası
-  Liste sayfası
-  Detay sayfası

Bu içerik türleri API'ın iş akışlarında sunduğu temel içerik türleridir. Bu içerik türlerinin kullanıcı arayüzünde
doğru biçimde yorumlanması için ``response`` nesnesinde gönderilecek anahtar değerler belirlenmiştir. Bu anahtarlar
aşağıdaki tablodaki gibidir;

+---------------+---------------+
| İçerik türü   | Anahtar       |
+===============+===============+
| Form          | ``forms``     |
+---------------+---------------+
| Liste         | ``objects``   |
+---------------+---------------+
| Detay         | ``object``    |
+---------------+---------------+

    Bu sayfa tipleri ``response`` nesnesinde aynı anda yer alırlarsa
    yukarıdan aşağıya doğru detay > form > liste olacak şekilde aynı
    sayfada yorumlanırlar.

Her sayfaya ait alt özellikler ilgili başlık altında anlatılacaktır.

Form sayfası
~~~~~~~~~~~~

Ulakbus UI form işlemlerini gerçekleştirmek için angular-schema-form_ extend edilmiştir. Kullanılan form nesneleri
angular-schema-form'un beklediği formatta olmalı ya da değilse extend edilerek `custom type` yaratılmalıdır.

Örnek bir ``forms`` nesnesi aşağıdaki gibidir:

.. _angular-schema-form: https://github.com/Textalk/angular-schema-form

.. code:: json

    {
        "forms":{
            "constraints":{},
            "model":{ "ad":null, "soyad":null },
            "grouping":{},
            "form":[
                { "helpvalue":null, "type":"help" },
                "ad",
                "soyad",
                {
                    "titleMap":[
                        { "name":"Bay", "value":1 },
                        { "name":"Bayan", "value":2 }
                    ],
                    "type":"select",
                    "key":"cinsiyet",
                    "title":"Cinsiyet"
                },
                "e_posta",
                "dogum_tarihi",
                "save_edit"
                "nufus_kayitlari_id",
            ],
            "schema":{
                "required":[ "ad", "soyad" ],
                "type":"object",
                "properties":{
                    "ad":{ "type":"string", "title":"Adı" },
                    "soyad":{ "type":"string", "title":"Soyadı" },
                    "e_posta":{ "type":"string", "title":"E-Posta" },
                    "save_edit":{ "cmd":"save::add_edit_form", "type":"button", "title":"Kaydet" },
                    "nufus_kayitlari_id":{
                        "list_cmd":"select_list",
                        "title":"Nüfus Bilgileri",
                        "wf":"crud",
                        "add_cmd":"add_edit_form",
                        "type":"model",
                        "model_name":"NufusKayitlari"
                    },
                    "dogum_tarihi":{ "type":"date", "title":"Doğum Tarihi" },
                    "cinsiyet":{ "type":"select", "title":"Cinsiyet" }
                },
                "title":"Personel"
            }
        }
    }


Liste sayfası
~~~~~~~~~~~~~

.. code:: json

    {
        "forms":{
            "constraints":{},
            "model":{ "add": null },
            "grouping":{},
            "form":[ "add" ],
            "schema":{
                "required":[ "add" ],
                "type":"object",
                "properties":{
                    "add":{
                        "cmd":"add_edit_form",
                        "type":"button",
                        "title":"Ekle"
                    }
                },
                "title":"Personeller"
            }
        },
        "pagination":{
            "per_page":8,
            "total_objects":26,
            "total_pages":3,
            "page":1
        },
        "objects":[
            [ "Adı", "Soyadı", "TC No", "Durum" ],
            {
                "fields":[
                    "Işık",
                    "Ülker",
                    "19189958696",
                    null
                ],
                "actions":[
                    {
                        "fields":[
                            0
                        ],
                        "cmd":"show",
                        "mode":"normal",
                        "show_as":"link"
                    },
                    {
                        "cmd":"add_edit_form",
                        "name":"Düzenle",
                        "show_as":"button",
                        "mode":"normal"
                    },
                    {
                        "cmd":"delete",
                        "name":"Sil",
                        "show_as":"button",
                        "mode":"normal"
                    }
                ],
                "key":"1234qwer"
            }
        ]
    }

Detay sayfası
~~~~~~~~~~~~~

.. code:: json

    {
        "object":{
            "Cep Telefonu":"+90 (259) 6925396",
            "Cinsiyet":"Erkek",
            "Soyadı":"Arsoy",
            "TC No":"63488661696",
            "Adı":"Kutun",
            "Doğum Tarihi":"03.04.1969",
            "E-Posta":"daslan@arsoy.com"
        }
    }

UI Menu ve Diğer Öğeler
=======================

.. code:: json

    {
        "ogrenci":[
            {
                "kategori":"Seçime Uygun Görevler",
                "text":"Devam Durumu",
                "model":"DersKatilimi",
                "param":"ogrenci_id",
                "wf":"crud"
            }
        ],
        "personel":[
            {
                "kategori":"Seçime Uygun Görevler",
                "text":"Kimlik ve Iletisim Bilgileri",
                "model":"Personel",
                "param":"object_id",
                "wf":"kimlik_ve_iletisim_bilgileri"
            }
        ],
        "settings":{
            "static_url":"http://ulakbus.3s.ulakbus.net/"
        },
        "other":[
            {
                "kategori":"Genel",
                "text":"Personeller",
                "model":"Personel",
                "param":"other_id",
                "wf":"crud"
            }
        ],
        "current_user":{
            "username":"test_user",
            "is_staff":true,
            "surname":"Stallman",
            "name":"Richard",
            "roles":[
                {
                    "role":"Role BaseAbsRole | test_user"
                },
                {
                    "role":"Role W.C. Hero test_user"
                }
            ],
            "role":"BaseAbsRole",
            "is_student":false,
            "avatar":"http://ulakbus.3s.ulakbus.net/abcd.jpg"
        },
        "is_login":true,
        "quick_menu":[
            {
                "kategori":"Genel",
                "text":"Programlar",
                "model":"Program",
                "param":"other_id",
                "wf":"crud"
            }
        ]
    }