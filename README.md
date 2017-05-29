# Layers

This is a tool that allows for processing _layered_ configuration files

Layered configuration files are quite useful when one wants to describe the configuration for different environments in terms of deltas. Most of the time one needs to _override_ properties from a base environment in order to minimize duplication in configuration and thus minimize the risk of mistakes.

The files are merged based on an additive principle, so if you have a base file

    {
      "key1": "1a",
      "key2": "2a",
      "subtree": {
        "key3": "3a",
        "key4": "4a",
        "key5": "5a"
      }
    }

and an overlay file

    {
      "key1": "1b",
      "subtree": {
        "key3": "3b",
      }
    }

then you will get a final outcome of

    {
      "key1": "1b",
      "key2": "2a",
      "subtree": {
        "key3": "3b",
        "key4": "4a",
        "key5": "5a"
      }
    }
    
It is also possible to have multiple layers.

Often you will want to process a directory of files. Then you can use a naming
convention for the top level directories:

    a
    b-from-a
    c-from-b

How to run the program:

    $ DEBUG=* node index.js sample c ./out`