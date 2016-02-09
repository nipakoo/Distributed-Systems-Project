#!/usr/bin/env python
import os
import sys

AppName = "spark_assignment_1"
TMPDIR = "/cs/work/scratch/spark-tmp"

### Creat a Spark context on Ukko cluster
from pyspark import SparkConf, SparkContext
conf = (SparkConf()
        .setMaster("spark://ukko080:7077")
        .setAppName(AppName)
        .set("spark.rdd.compress", "true")
        .set("spark.broadcast.compress", "true")
        .set("spark.cores.max", 20)
        .set("spark.local.dir", TMPDIR))
sc = SparkContext(conf = conf)

# swap key and value so the key is in the correct place for lookup()
def assign_key(element):
    return element[1], element[0]

if __name__=="__main__":
    data = sc.textFile('/cs/work/scratch/spark-data/data-1.txt').map(lambda s: float(s))

    myMin = data.min()
    myMax = data.max()
    myVar = data.variance()
    # sort the list, assignt a key for each element and use it to get the middle element
    myMed = data.sortBy(lambda i: i).zipWithIndex().map(lambda row: assign_key(row)).lookup(data.count() / 2)[0]

    print "Minimum value = %.8f" % myMin # = 0.00000011
    print "Maximum value = %.8f" % myMax # = 99.99999990
    print "Variance = %.8f" % myVar # = 833.34032224
    print "Median = %.8f" % myMed # = 50.00048615

    sys.exit(0)