ULAKBUS API-UI Etkileşimi
=========================

.. figure:: http://ulakbus.net/img/brand-logo.png :alt: Ulakbus_logo

Bu belge **Ulakbus API ve UI** bileşenlerinin etkileşimini göstermek
için hazırlanmıştır. API kullanılarak hazırlanan view, model ve jenerik fonksiyonlarda hangi tip verinin kullanıcı
arayüzünde nasıl gösterildiğini bu belgede bulabilirsiniz.


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
    yukarıdan aşağıya doğru detay - form - liste olacak şekilde aynı
    sayfada yorumlanırlar.

Her sayfaya ait alt özellikler ilgili başlık altında anlatılacaktır.

Form sayfası
~~~~~~~~~~~~

Ulakbus UI form işlemlerini gerçekleştirmek için angular-schemaform_ Örnek bir ``forms`` nesnesi aşağıdaki gibidir:

.. _angular-schemaform:

.. code:: json

    {
        "forms": {
            "form": [],
            "schema": {
                "properties": {},
                "type": Object,
                "required": []
            },
            "model": {}
        }
    }

Liste sayfası
~~~~~~~~~~~~~

Detay sayfası
~~~~~~~~~~~~~
